import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useLazyFindUserQuery } from "@/feature/User/userApi";
import { useCreateDirectConversationMutation } from "@/feature/Conversation/conversationApi";
import logger from "@/utils/logger";
import { addRecentSearch, getRecentSearch } from "@/utils/searchHistory";
import UserProfileModal from "@/components/UserProfileModal";
import { useSelector } from "react-redux";
import { selectUser } from "@/feature/User/userSelector";
import { useNavigate } from "react-router-dom";


function IconFriend() {
  const { user: currentUser } = useSelector(selectUser)
  const navigate = useNavigate()
  
  const [triggerFindUser, { data, isLoading, isError, error }] = useLazyFindUserQuery();
  const [ createDirectConversation, {isLoading: createDirectLoading, error: createDirectError}] = useCreateDirectConversationMutation()
  const [value, setValue] = useState("")
  const [showProfile, setShowProfile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const historySearch = getRecentSearch()
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAdd = async (targetUserId) => {
    try {
      await createDirectConversation(targetUserId).unwrap()
      setShowProfile(true);
    } catch (err) {
      logger.log(err);
    }
  }

  const handleFindUser = async () => {
    if(!value) return;
    try {
        const result = await triggerFindUser(value).unwrap();
        addRecentSearch(result)
        setSelectedUser(data);
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
            {historySearch.length > 0 && historySearch.map((item) => {
              return (
              <div key={item.id}>
                <p className="text-sm opacity-70">Kết quả gần nhất</p>
                <p className="cursor-pointer hover:bg-amber-100 px-3 py-3" 
                onClick={() => handleSelectHistory(item)} >{item.name}</p>
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
