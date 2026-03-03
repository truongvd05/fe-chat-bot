import { selectUser } from "@/feature/User/userSelector"
import { useSelector } from "react-redux"
import { Pencil } from "lucide-react"
import { useNavigate } from "react-router-dom"
function Profile() {
    const {user} = useSelector(selectUser)
    const navigate = useNavigate()
  return (
    <div className="p-6 space-y-6">

      {/* Name */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tên</p>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <Pencil size={18} />
        </button>
      </div>

      <div className="border-t" />

      {/* Account Info */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p>{user?.email}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Vai trò</p>
          <p>{user?.role}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Ngày tạo</p>
          <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="border-t" />

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={() => navigate("/change-password")} className="w-full border rounded-lg py-2 hover:bg-gray-50">
          Đổi mật khẩu
        </button>
      </div>
    </div>
  )
}

export default Profile