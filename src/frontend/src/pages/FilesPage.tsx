import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Archive, File, FileText, Image } from "lucide-react";
import { Layout } from "../components/Layout";
import { UploadZone } from "../components/UploadZone";
import { useListFiles } from "../hooks/useFiles";
import type { FileMetadata } from "../types";

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
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function FileCard({ file, index }: { file: FileMetadata; index: number }) {
  const Icon = getFileIcon(file.mimeType);
  const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <Link
      to="/files/$fileId"
      params={{ fileId: file.id.toString() }}
      data-ocid={`files.item.${index + 1}`}
      className="block group"
    >
      <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:border-accent/40 transition-smooth cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20 group-hover:bg-accent/20 transition-smooth">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-display font-semibold text-sm text-foreground truncate"
              title={file.name}
            >
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatSize(file.size)}
            </p>
          </div>
          <span className="shrink-0 text-xs font-mono font-medium text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded">
            {ext}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Uploaded {formatDate(file.uploadedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function FilesPage() {
  const { data: files, isLoading, isError } = useListFiles();

  const sorted = files
    ? [...files].sort((a, b) => Number(b.uploadedAt - a.uploadedAt))
    : [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              My Files
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading
                ? "Loading files..."
                : `${sorted.length} file${sorted.length !== 1 ? "s" : ""} stored`}
            </p>
          </div>
        </div>

        {/* Upload zone */}
        <UploadZone />

        {/* Error state */}
        {isError && (
          <div
            className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive"
            data-ocid="files.error_state"
          >
            Failed to load files. Please try refreshing the page.
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="files.loading_state"
          >
            {["l1", "l2", "l3", "l4", "l5", "l6"].map((id) => (
              <Skeleton key={id} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && sorted.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center space-y-3"
            data-ocid="files.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center border border-border">
              <File className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-base text-foreground">
              No files yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your uploaded files will appear here.
            </p>
          </div>
        )}

        {/* File grid */}
        {!isLoading && sorted.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="files.list"
          >
            {sorted.map((file, i) => (
              <FileCard key={file.id.toString()} file={file} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
