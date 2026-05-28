import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUploadAvatarMutation } from "@/feature/User/userApi";
import logger from "@/utils/logger";
import { useRef, useState } from "react";
import { toast } from "sonner";
import EditProfilePanel from "../EditProfilePanel";
import Lightbox from "../Lightbox";

/**
 * UserProfileModal
 *
 * Props:
 *  user          object   dữ liệu user cần hiển thị
 *  currentUserId string   id của người đang đăng nhập
 *  isOpen        bool     trạng thái mở Dialog
 *  onClose       fn       callback đóng
 *  onAddFriend   fn(id)   callback kết bạn
 *  onMessage     fn(id)   callback nhắn tin
 */
function UserProfileModal({
  user,
  currentUserId,
  isOpen,
  onClose,
  onAddFriend,
  onMessage,
}) {
  if (!user) return null;

  const fileInputRef = useRef(null);
  const [uploadAvatar] = useUploadAvatarMutation();
  const [showEdit, setShowEdit] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadAvatar(formData).unwrap();
      toast.success("Tải ảnh lên thành công");
    } catch (err) {
      logger.log(err);
      toast.error("Lỗi không xác định");
    }
  };

  const isSelf = user.id === currentUserId;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="p-0 overflow-hidden max-w-md h-[80vh] flex flex-col">
          <div className="flex flex-col h-full relative overflow-hidden">
  
            {/* ── PROFILE VIEW ── */}
            <div
              className="flex flex-col h-full transition-transform duration-300 ease-in-out"
              style={{ transform: showEdit ? "translateX(-100%)" : "translateX(0)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <i className="fa-solid fa-arrow-left text-gray-600" />
                </button>
                <span className="font-medium text-sm">Thông tin tài khoản</span>
              </div>
  
              <div className="flex-1 overflow-y-auto">
                {/* Cover */}
                <div className="h-36 bg-gradient-to-r from-blue-400 to-blue-600 shrink-0" />
  
                <div className="px-6 pb-6 relative">
                  {/* Avatar + Name */}
                  <div className="flex items-end gap-3 -mt-10 mb-4">
                    <div className="relative">
                      <img
                        src={user.avatarUrl || "/default-avatar.png"}
                        className="w-20 h-20 rounded-full border-4 border-white object-cover shadow"
                        alt={user.name}
                        onClick={() => setLightboxSrc(user.avatarUrl || "/default-avatar.png")}
                      />
                      {isSelf && (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                          <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1 text-xs hover:bg-gray-300"
                          >
                            <i className="fa-solid fa-camera" />
                          </button>
                        </>
                      )}
                    </div>
  
                    <div className="flex items-center gap-2 pb-1">
                      <h2 className="text-lg font-semibold">{user.name}</h2>
                      {isSelf && (
                        <button
                          onClick={() => setShowEdit(true)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Chỉnh sửa thông tin"
                        >
                          <i className="fa-solid fa-pen text-gray-400 text-sm hover:text-blue-500 transition-colors" />
                        </button>
                      )}
                    </div>
                  </div>
  
                  {/* Info */}
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <h3 className="font-semibold text-gray-700 mb-3">Thông tin cá nhân</h3>
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-20 shrink-0">Bio</span>
                      <span className="text-gray-800 whitespace-pre-line">{user.bio}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-20 shrink-0">Giới tính</span>
                      <span>{user.gender}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-20 shrink-0">Ngày sinh</span>
                      <span>{user.birthday}</span>
                    </div>
                    {user.phonenumber && (
                      <div className="flex gap-4">
                        <span className="text-gray-500 w-20 shrink-0">Điện thoại</span>
                        <span>{user.phonenumber}</span>
                      </div>
                    )}
                  </div>
  
                  {/* Actions */}
                  {!isSelf && (
                    <div className="mt-6 border-t pt-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => onAddFriend(user.id)}
                          className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Kết bạn
                        </button>
                        <button
                          onClick={() => onMessage(user.id)}
                          className="flex-1 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                        >
                          Nhắn tin
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* ── EDIT PANEL ── */}
            <EditProfilePanel
              isOpen={showEdit}
              onClose={() => setShowEdit(false)}
            />
  
          </div>
        </DialogContent>
      </Dialog>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}

export default UserProfileModal;