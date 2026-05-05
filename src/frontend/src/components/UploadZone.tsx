import { Progress } from "@/components/ui/progress";
import { CloudUpload, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useUploadFile } from "../hooks/useFiles";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    mutate: uploadFile,
    isPending,
    uploadProgress,
    isError,
    error,
  } = useUploadFile();

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      for (const file of Array.from(files)) uploadFile(file);
    },
    [uploadFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFiles],
  );

  const openFilePicker = () => {
    if (!isPending) fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3" data-ocid="upload.dropzone">
      {/* Drag-and-drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-smooth",
          isDragging
            ? "border-accent bg-accent/10 scale-[1.01]"
            : "border-border bg-card",
          isPending ? "opacity-70 pointer-events-none" : "",
        ].join(" ")}
      >
        <div
          className={[
            "w-14 h-14 rounded-2xl flex items-center justify-center border transition-smooth",
            isDragging
              ? "bg-accent/20 border-accent/40"
              : "bg-muted border-border",
          ].join(" ")}
        >
          {isPending ? (
            <Loader2 className="w-7 h-7 text-accent animate-spin" />
          ) : (
            <CloudUpload
              className={[
                "w-7 h-7 transition-smooth",
                isDragging ? "text-accent" : "text-muted-foreground",
              ].join(" ")}
            />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="font-display font-semibold text-sm text-foreground">
            {isPending
              ? "Uploading…"
              : isDragging
                ? "Drop to upload"
                : "Drag & drop files here"}
          </p>
          {!isPending && (
            <p className="text-xs text-muted-foreground">
              or{" "}
              <button
                type="button"
                onClick={openFilePicker}
                className="text-accent font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                data-ocid="upload.button"
              >
                click to browse
              </button>
            </p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={onInputChange}
          data-ocid="upload.input"
        />
      </div>

      {/* Progress bar */}
      {isPending && uploadProgress > 0 && (
        <div className="space-y-1.5" data-ocid="upload.loading_state">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-medium">
              Uploading…
            </span>
            <span className="text-xs font-mono font-semibold text-accent">
              {Math.round(uploadProgress)}%
            </span>
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      {/* Error state */}
      {isError && error && (
        <div
          className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-xs text-destructive"
          data-ocid="upload.error_state"
        >
          Upload failed: {error.message}
        </div>
      )}
    </div>
  );
}
