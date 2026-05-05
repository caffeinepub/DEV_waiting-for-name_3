import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type FileRecord = {
    id : Common.FileId;
    owner : Common.UserId;
    name : Text;
    size : Nat;
    mimeType : Text;
    uploadedAt : Common.Timestamp;
    blob : Storage.ExternalBlob;
  };

  public type FileMetadata = {
    id : Common.FileId;
    owner : Common.UserId;
    name : Text;
    size : Nat;
    mimeType : Text;
    uploadedAt : Common.Timestamp;
    blob : Storage.ExternalBlob;
  };

  public type UploadFileArgs = {
    name : Text;
    size : Nat;
    mimeType : Text;
    blob : Storage.ExternalBlob;
  };
};
