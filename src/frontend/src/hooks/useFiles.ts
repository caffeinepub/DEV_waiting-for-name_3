import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ExternalBlob, type backendInterface, createActor } from "../backend";
import type { FileId, FileMetadata } from "../backend.d";

export function useListFiles() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<FileMetadata[]>({
    queryKey: ["files"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFiles();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetFile(fileId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<FileMetadata | null>({
    queryKey: ["file", fileId?.toString()],
    queryFn: async () => {
      if (!actor || fileId === null) return null;
      return actor.getFile(fileId as FileId);
    },
    enabled: !!actor && !actorFetching && fileId !== null,
  });
}

export function useDeleteFile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, bigint>({
    mutationFn: async (fileId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFile(fileId as FileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useUploadFile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const mutation = useMutation<bigint, Error, File>({
    mutationFn: async (file: File) => {
      if (!actor) throw new Error("Actor not available");

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const backend = actor as unknown as backendInterface;
      const fileId = await backend.uploadFile({
        blob,
        name: file.name,
        size: BigInt(file.size),
        mimeType: file.type || "application/octet-stream",
      });

      setUploadProgress(0);
      return fileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: () => {
      setUploadProgress(0);
    },
  });

  return { ...mutation, uploadProgress };
}
