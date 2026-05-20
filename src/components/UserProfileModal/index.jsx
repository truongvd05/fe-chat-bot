import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

/**
 * UserProfileModal
 *
 * mode="modal"  → Dialog độc lập (dùng khi click avatar trong chat, v.v.)
 * mode="panel"  → Render inline, trượt vào trong slide panel của IconFriend
 *
 * Props:
 *  user          object   dữ liệu user cần hiển thị
 *  currentUserId string   id của người đang đăng nhập (để tự detect isSelf)
 *  isOpen        bool     (chỉ dùng khi mode="modal")
 *  onClose       fn       callback đóng (modal) hoặc back (panel)
 *  onAddFriend   fn(id)   callback kết bạn / nhắn tin
 *  mode          string   "modal" | "panel"  (default: "modal")
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

  const isSelf = user.id === currentUserId;

  const content = (
    <div className="flex flex-col h-full">
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
        <div className="h-36 bg-linear-to-r from-blue-400 to-blue-600 shrink-0" />
        <div className="px-6 pb-6 relative">
          <div className="flex items-end gap-3 -mt-10 mb-4">
            <div className="relative">
              <img
                src={user.avatar || "/default-avatar.png"}
                className="w-20 h-20 rounded-full border-4 border-white object-cover shadow"
              />
              {isSelf && (
                <button className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1 text-xs hover:bg-gray-300">
                  <i className="fa-solid fa-camera" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 pb-1">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              {isSelf && (
                <i className="fa-solid fa-pen text-gray-400 text-sm cursor-pointer hover:text-gray-600" />
              )}
            </div>
          </div>

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

          <div className="mt-6 border-t pt-4">
            {isSelf ? (
              <button className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">
                <i className="fa-solid fa-pen" />
                Cập nhật
              </button>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-md h-[80vh] flex flex-col">
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default UserProfileModal;