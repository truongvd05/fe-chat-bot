import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAddFriendMutation, useLazyFindUserQuery } from "@/feature/User/userApi";
import logger from "@/utils/logger";
import { addRecentSearch, getRecentSearch } from "@/utils/searchHistory";
import UserProfileModal from "@/components/UserProfileModal";
import { useSelector } from "react-redux";
import { selectUser } from "@/feature/User/userSelector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateDirectConversationMutation } from "@/feature/Conversation/conversationApi";


function IconFriend() {
  const { user: currentUser } = useSelector(selectUser)
  const navigate = useNavigate()
  
  const [triggerFindUser, { data, isLoading, isError, error }] = useLazyFindUserQuery();
  const [ addFriend, {isLoading: addFriendLoading, error: addFriendError}] = useAddFriendMutation()
  const [ createDirectConversation, {isLoading: createDirectConversationLoading, error: createDirectConversationLoadingError}] = useCreateDirectConversationMutation()
  const [value, setValue] = useState("")
  const [showProfile, setShowProfile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const historySearch = getRecentSearch()
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAdd = async (targetUserId) => {
    try {
      await addFriend({targetUserId}).unwrap()
      toast.success("Đã gửi lời mời kết bạn thành công")
      setShowProfile(true);
    } catch (err) {
      if(err.status === 429) {
        toast.error("đừng spam nữa")
      }
      logger.log(err);
    }
  }

  const handleFindUser = async () => {
    if(!value) return;
    try {
        const result = await triggerFindUser(value).unwrap();
        addRecentSearch(result)
        setSelectedUser(result);
        setShowProfile(true)
    } catch (err) {
      logger.log(err);
    }
  };

  const handleSelectHistory = async (item) => {
    try {
      const result = await triggerFindUser(item.phonenumber).unwrap();
      setSelectedUser(result);
      setShowProfile(true);
    } catch (err) {
      setSelectedUser(item);
      setShowProfile(true);
    }
  };

  const handleMessage = async (targetUserId) => {
    try {
      const result = await createDirectConversation(targetUserId).unwrap();
      setShowProfile(false);
      setOpenDialog(false);
      navigate(`/chat/${result.id}`)
    } catch (err) {
      logger.log(err);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className= "hover:bg-amber-100 p-2 rounded-lg"><i className="fa-solid fa-user-plus"></i></DialogTrigger>
      <DialogContent className="h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tìm kiếm bạn bè.</DialogTitle>
        </DialogHeader>
            <Input value={value} onChange={(e)=> setValue(e.target.value)} type="text" autoComplete="name" placeholder="nhập số điện thoại"/>
            <p className="text-sm opacity-70">Kết quả gần nhất</p>
            {historySearch.length > 0 && historySearch.map((item) => {
              return (
              <div key={item.id} className="flex items-center p-2 hover:bg-amber-100" onClick={() => handleSelectHistory(item)}>
                <img className="w-10 h-10" src={item.avatarUrl || "https://www.shutterstock.com/image-vector/default-avatar-social-media-display-600nw-2632690107.jpg"} alt='avatar' />
                <p className="flex cursor-pointer  px-3 py-3" 
                 >{item.name}</p>
              </div>)
              })
            }
        {showProfile && <UserProfileModal
          isOpen={showProfile}
          currentUserId={currentUser.id}
          onClose={() => setShowProfile(false)}
          user={selectedUser}
          isSelf={false}
          onAddFriend={handleAdd}
          onMessage={handleMessage}
        />}
        <DialogFooter className="mt-auto">
          <DialogClose asChild>
            <button onClick={() => {
              setValue("")
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Hủy
            </button>
          </DialogClose>
            <button onClick={handleFindUser} disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {isLoading ? "Đang tìm..." : "Tìm kiếm" }
            </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default IconFriend;
