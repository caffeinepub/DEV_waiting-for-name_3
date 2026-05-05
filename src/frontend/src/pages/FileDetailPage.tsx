import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  Download,
  File,
  FileText,
  Image,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useDeleteFile, useGetFile } from "../hooks/useFiles";

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType === "application/pdf") return FileText;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return Archive;
  return File;
}

function formatSize(bytes: bigint): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

interface DownloadState {
  status: "idle" | "downloading" | "error";
  progress: number; // 0–100
  received: number; // bytes received
  total: number; // total bytes (0 if unknown)
  error?: string;
}

const IDLE_STATE: DownloadState = {
  status: "idle",
  progress: 0,
  received: 0,
  total: 0,
};

export default function FileDetailPage() {
  const { fileId } = useParams({ from: "/files/$fileId" });
  const navigate = useNavigate();
  const fileIdBig = BigInt(fileId);

  const { data: file, isLoading, isError } = useGetFile(fileIdBig);
  const deleteFile = useDeleteFile();

  const [dlState, setDlState] = useState<DownloadState>(IDLE_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const handleDownload = useCallback(async () => {
    if (!file) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setDlState({ status: "downloading", progress: 0, received: 0, total: 0 });

    try {
      const directUrl = file.blob.getDirectURL();

      const response = await fetch(directUrl, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status} ${response.statusText}`,
        );
      }

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? Number.parseInt(contentLength, 10) : 0;

      if (!response.body) {
        throw new Error("Response body is not readable");
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;

        const progress =
          total > 0 ? Math.min(100, Math.round((received / total) * 100)) : 0;
        setDlState({ status: "downloading", progress, received, total });
      }

      // Combine all chunks into a single Uint8Array
      const allBytes = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        allBytes.set(chunk, offset);
        offset += chunk.length;
      }

      const blob = new Blob([allBytes], { type: file.mimeType });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);

      setDlState(IDLE_STATE);
      toast.success("Download complete.");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setDlState(IDLE_STATE);
        toast.info("Download cancelled.");
        return;
      }
      const msg =
        err instanceof Error ? err.message : "Unknown error occurred.";
      setDlState({
        status: "error",
        progress: 0,
        received: 0,
        total: 0,
        error: msg,
      });
      toast.error(`Download failed: ${msg}`);
    } finally {
      abortRef.current = null;
    }
  }, [file]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteFile.mutateAsync(fileIdBig);
      toast.success("File deleted successfully.");
      navigate({ to: "/files" });
    } catch {
      toast.error("Failed to delete file.");
    }
  };

  const Icon = file ? getFileIcon(file.mimeType) : File;
  const isDownloading = dlState.status === "downloading";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back nav */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/files" })}
          className="gap-2 text-muted-foreground hover:text-foreground -ml-1"
          data-ocid="file_detail.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Files
        </Button>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4" data-ocid="file_detail.loading_state">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {/* Error / not found */}
        {isError || (!isLoading && !file) ? (
          <div
            className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center space-y-2"
            data-ocid="file_detail.error_state"
          >
            <p className="font-semibold text-destructive">File not found</p>
            <p className="text-sm text-muted-foreground">
              This file may have been deleted or you don't have permission to
              view it.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/files" })}
              className="mt-2"
              data-ocid="file_detail.back_secondary_button"
            >
              Go back to files
            </Button>
          </div>
        ) : null}

        {/* File details */}
        {!isLoading && file && (
          <>
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                <Icon className="w-7 h-7 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h1
                  className="font-display font-bold text-xl text-foreground break-words"
                  data-ocid="file_detail.card"
                >
                  {file.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {file.mimeType}
                </p>
              </div>
            </div>

            {/* Metadata card */}
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {[
                { label: "File Size", value: formatSize(file.size) },
                { label: "Uploaded", value: formatDate(file.uploadedAt) },
                { label: "File ID", value: file.id.toString(), mono: true },
                { label: "Owner", value: file.owner.toString(), mono: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-3 gap-4"
                >
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                    {row.label}
                  </span>
                  <span
                    className={`text-sm text-foreground text-right truncate ${row.mono ? "font-mono text-xs" : ""}`}
                    title={row.value}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Download progress panel */}
            {isDownloading && (
              <div
                className="bg-card border border-border rounded-xl p-4 space-y-3"
                data-ocid="file_detail.loading_state"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Loader2 className="w-4 h-4 animate-spin text-accent shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Downloading…
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {dlState.total > 0
                          ? `${formatBytes(dlState.received)} of ${formatBytes(dlState.total)}`
                          : formatBytes(dlState.received)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {dlState.total > 0 && (
                      <span className="text-sm font-semibold text-accent tabular-nums">
                        {dlState.progress}%
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={handleCancel}
                      aria-label="Cancel download"
                      data-ocid="file_detail.cancel_button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  {dlState.total > 0 ? (
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-200"
                      style={{ width: `${dlState.progress}%` }}
                    />
                  ) : (
                    <div className="h-full w-1/3 rounded-full bg-accent animate-[indeterminate_1.5s_ease-in-out_infinite]" />
                  )}
                </div>
              </div>
            )}

            {/* Download error */}
            {dlState.status === "error" && (
              <div
                className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-destructive"
                data-ocid="file_detail.error_state"
              >
                <span className="font-medium">Download failed:</span>
                <span className="text-muted-foreground truncate">
                  {dlState.error}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
                onClick={handleDownload}
                disabled={isDownloading}
                data-ocid="file_detail.download_button"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading…
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download File
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-smooth"
                    disabled={isDownloading}
                    data-ocid="file_detail.delete_button"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete File
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  className="bg-card border-border"
                  data-ocid="file_detail.dialog"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-foreground">
                      Delete this file?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      <strong className="text-foreground">{file.name}</strong>{" "}
                      will be permanently deleted and cannot be recovered.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="transition-smooth"
                      data-ocid="file_detail.cancel_button"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteFile.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-smooth"
                      data-ocid="file_detail.confirm_button"
                    >
                      {deleteFile.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
