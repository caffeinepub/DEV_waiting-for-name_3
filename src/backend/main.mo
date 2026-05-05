import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import CommonTypes "types/common";
import FileTypes "types/files";
import FileLib "lib/files";
import FilesMixin "mixins/files-api";

actor {
  include MixinObjectStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let fileStore : FileLib.FileStore = Map.empty<CommonTypes.FileId, FileTypes.FileRecord>();
  let userFileIndex : FileLib.UserFileIndex = Map.empty<CommonTypes.UserId, List.List<CommonTypes.FileId>>();
  let nextFileId = { var value : Nat = 0 };

  include FilesMixin(accessControlState, fileStore, userFileIndex, nextFileId);
};
