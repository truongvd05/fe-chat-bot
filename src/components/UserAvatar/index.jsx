import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "@/feature/User/userSelector";
import UserProfileModal from "@/components/UserProfileModal";

function UserAvatar() {
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all"
      >
        <img
          src={user.avatar || "/default-avatar.png"}
          className="w-full h-full object-cover"
        />
      </button>

      {open && (
        <UserProfileModal
          isOpen={open}
          user={user}
          currentUserId={user.id}
          onClose={() => setOpen(false)}
          onUpdate={() => {
            setOpen(false);
            navigate("/profile");
          }}
        />
      )}
    </>
  );
}

export default UserAvatar;