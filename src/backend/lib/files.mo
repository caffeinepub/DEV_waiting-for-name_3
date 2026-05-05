import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import FileTypes "../types/files";

module {
  public type FileStore = Map.Map<CommonTypes.FileId, FileTypes.FileRecord>;
  public type UserFileIndex = Map.Map<CommonTypes.UserId, List.List<CommonTypes.FileId>>;

  public func uploadFile(
    store : FileStore,
    userIndex : UserFileIndex,
    nextId : Nat,
    caller : Principal,
    args : FileTypes.UploadFileArgs,
  ) : CommonTypes.FileId {
    let record : FileTypes.FileRecord = {
      id = nextId;
      owner = caller;
      name = args.name;
      size = args.size;
      mimeType = args.mimeType;
      uploadedAt = Time.now();
      blob = args.blob;
    };
    store.add(nextId, record);
    // Update user file index
    switch (userIndex.get(caller)) {
      case (?list) { list.add(nextId) };
      case null {
        let list = List.empty<CommonTypes.FileId>();
        list.add(nextId);
        userIndex.add(caller, list);
      };
    };
    nextId;
  };

  public func listUserFiles(
    store : FileStore,
    userIndex : UserFileIndex,
    caller : Principal,
  ) : [FileTypes.FileMetadata] {
    switch (userIndex.get(caller)) {
      case null { [] };
      case (?idList) {
        // Collect file records, filter by ownership, sort newest-first
        let records = idList.filterMap<CommonTypes.FileId, FileTypes.FileMetadata>(
          func(id) {
            switch (store.get(id)) {
              case (?rec) {
                if (Principal.equal(rec.owner, caller)) {
                  ?{
                    id = rec.id;
                    owner = rec.owner;
                    name = rec.name;
                    size = rec.size;
                    mimeType = rec.mimeType;
                    uploadedAt = rec.uploadedAt;
                    blob = rec.blob;
                  }
                } else { null }
              };
              case null { null };
            }
          }
        );
        // Sort newest-first by uploadedAt (Int, descending)
        let arr = records.toArray();
        arr.sort<FileTypes.FileMetadata>(
          func(a, b) { Int.compare(b.uploadedAt, a.uploadedAt) },
        );
      };
    };
  };

  public func getFile(
    store : FileStore,
    caller : Principal,
    fileId : CommonTypes.FileId,
  ) : ?FileTypes.FileMetadata {
    switch (store.get(fileId)) {
      case null { null };
      case (?rec) {
        if (not Principal.equal(rec.owner, caller)) {
          Runtime.trap("Unauthorized: You do not own this file");
        };
        ?{
          id = rec.id;
          owner = rec.owner;
          name = rec.name;
          size = rec.size;
          mimeType = rec.mimeType;
          uploadedAt = rec.uploadedAt;
          blob = rec.blob;
        };
      };
    };
  };

  public func deleteFile(
    store : FileStore,
    userIndex : UserFileIndex,
    caller : Principal,
    fileId : CommonTypes.FileId,
  ) : Bool {
    switch (store.get(fileId)) {
      case null { false };
      case (?rec) {
        if (not Principal.equal(rec.owner, caller)) {
          Runtime.trap("Unauthorized: You do not own this file");
        };
        store.remove(fileId);
        // Remove from user index
        switch (userIndex.get(caller)) {
          case null {};
          case (?idList) {
            let updated = idList.filter(func(id) { id != fileId });
            userIndex.add(caller, updated);
          };
        };
        true;
      };
    };
  };
};
