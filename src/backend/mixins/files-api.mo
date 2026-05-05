import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import FileTypes "../types/files";
import FileLib "../lib/files";

mixin (
  accessControlState : AccessControl.AccessControlState,
  fileStore : FileLib.FileStore,
  userFileIndex : FileLib.UserFileIndex,
  nextFileId : { var value : Nat },
) {
  public shared ({ caller }) func uploadFile(args : FileTypes.UploadFileArgs) : async CommonTypes.FileId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to upload files");
    };
    let id = FileLib.uploadFile(fileStore, userFileIndex, nextFileId.value, caller, args);
    nextFileId.value += 1;
    id;
  };

  public query ({ caller }) func listFiles() : async [FileTypes.FileMetadata] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to list files");
    };
    FileLib.listUserFiles(fileStore, userFileIndex, caller);
  };

  public query ({ caller }) func getFile(fileId : CommonTypes.FileId) : async ?FileTypes.FileMetadata {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to access files");
    };
    FileLib.getFile(fileStore, caller, fileId);
  };

  public shared ({ caller }) func deleteFile(fileId : CommonTypes.FileId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to delete files");
    };
    FileLib.deleteFile(fileStore, userFileIndex, caller, fileId);
  };
};
