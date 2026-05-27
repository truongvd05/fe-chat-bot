import { useEditUserMutation } from "@/feature/User/userApi";
import { selectUser } from "@/feature/User/userSelector";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

/**
 * EditProfilePanel
 *
 * Props:
 *  user      object   dữ liệu user hiện tại
 *  isOpen    bool     hiển thị hay ẩn panel
 *  onClose   fn       callback đóng panel (back)
 *  onSaved   fn(data) callback sau khi lưu thành công
 */
function EditProfilePanel({isOpen, onClose }) {
    const {user} = useSelector(selectUser)
    
    const [editName, setEditName] = useState(user?.name || "");
    const [editBio, setEditBio] = useState(user?.bio || "");
    const [editBirthday, setEditBirthday] = useState(user?.birthday || "");
    const [editGender, setEditGender] = useState(user?.gender || "");

    const [updateUser, {isLoading}] = useEditUserMutation()

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await updateUser({
        name: editName,
        bio: editBio,
        birthday: editBirthday,
        gender: editGender,
        }).unwrap();
        toast.success("Cập nhật thành công");
        onClose();
    } catch (err) {
        toast.error(err?.data?.message || "Cập nhật thất bại");
    }
    };

  return (
    <div
      className="absolute inset-0 flex flex-col bg-white transition-transform duration-300 ease-in-out"
      style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <fieldset disabled={isLoading} className="flex flex-col h-full min-w-0 border-0 p-0 m-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <i className="fa-solid fa-arrow-left text-gray-600" />
            </button>
            <span className="font-medium text-sm flex-1">Chỉnh sửa thông tin</span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Tên */}
            <div className="space-y-1.5">
              <label htmlFor="edit-name" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Tên hiển thị
              </label>
              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Ngày sinh */}
            <div className="space-y-1.5">
              <label htmlFor="edit-birthday" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Ngày sinh
              </label>
              <input
                id="edit-birthday"
                type="date"
                value={editBirthday}
                onChange={(e) => setEditBirthday(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label htmlFor="edit-bio" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Bio
              </label>
              <textarea
                id="edit-bio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Giới thiệu về bản thân..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Giới tính */}
            <div className="space-y-2 border-0 p-0 m-0">
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Giới tính
              </legend>
              <div className="flex gap-3 mt-1.5">
                <label
                  className={`flex-1 flex items-center gap-2.5 border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                    editGender === "Nam"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={editGender === "Nam"}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Nam</span>
                  <i className="fa-solid fa-mars text-blue-400 ml-auto" />
                </label>

                <label
                  className={`flex-1 flex items-center gap-2.5 border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                    editGender === "Nữ"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={editGender === "Nữ"}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="accent-pink-500 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Nữ</span>
                  <i className="fa-solid fa-venus text-pink-400 ml-auto" />
                </label>
              </div>
            </div>
            <button
                type="submit"
                className=" mt-10 flex ml-auto px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                {isLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default EditProfilePanel;