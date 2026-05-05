import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type UserId = Principal;
export type Timestamp = bigint;
export interface FileMetadata {
    id: FileId;
    owner: UserId;
    blob: ExternalBlob;
    name: string;
    size: bigint;
    mimeType: string;
    uploadedAt: Timestamp;
}
export interface UploadFileArgs {
    blob: ExternalBlob;
    name: string;
    size: bigint;
    mimeType: string;
}
export type FileId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteFile(fileId: FileId): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getFile(fileId: FileId): Promise<FileMetadata | null>;
    isCallerAdmin(): Promise<boolean>;
    listFiles(): Promise<Array<FileMetadata>>;
    uploadFile(args: UploadFileArgs): Promise<FileId>;
}
