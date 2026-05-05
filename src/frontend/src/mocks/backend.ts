import type { backendInterface, FileMetadata, UserRole } from "../backend";
import { ExternalBlob } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleFiles: FileMetadata[] = [
  {
    id: BigInt(1),
    owner: { toText: () => "aaaaa-aa" } as any,
    blob: ExternalBlob.fromURL("https://example.com/file1.pdf"),
    name: "Tax_Return_2023.pdf",
    size: BigInt(1_258_291),
    mimeType: "application/pdf",
    uploadedAt: now - BigInt(3600_000_000_000),
  },
  {
    id: BigInt(2),
    owner: { toText: () => "aaaaa-aa" } as any,
    blob: ExternalBlob.fromURL("https://example.com/file2.png"),
    name: "Design_Mockups.png",
    size: BigInt(345_000),
    mimeType: "image/png",
    uploadedAt: now - BigInt(7200_000_000_000),
  },
  {
    id: BigInt(3),
    owner: { toText: () => "aaaaa-aa" } as any,
    blob: ExternalBlob.fromURL("https://example.com/file3.docx"),
    name: "Contracts_2024.docx",
    size: BigInt(4_700_000),
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uploadedAt: now - BigInt(86400_000_000_000),
  },
];

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async (_hashes) => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async (_blobs) => undefined,
  _immutableObjectStorageCreateCertificate: async (_blobHash) => ({ method: "", blob_hash: "" }),
  _immutableObjectStorageRefillCashier: async (_refillInformation) => ({}),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async (_user, _role) => undefined,
  deleteFile: async (_fileId) => true,
  getCallerUserRole: async () => "user" as unknown as UserRole,
  getFile: async (fileId) => sampleFiles.find((f) => f.id === fileId) ?? null,
  isCallerAdmin: async () => false,
  listFiles: async () => sampleFiles,
  uploadFile: async (_args) => BigInt(4),
};
