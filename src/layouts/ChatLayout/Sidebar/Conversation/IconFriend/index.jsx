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


function IconFriend() {
  const [triggerFindUser, { data, isLoading, isError, error }] = useLazyFindUserQuery();
  const [ createDirectConversation, {isLoading: createDirectLoading, error: createDirectError}] = useCreateDirectConversationMutation()
  const [active, setActive] = useState(null)
  const [value, setValue] = useState("")

  const handleAdd = async (targetUserId) => {
    try {
      await createDirectConversation(targetUserId).unwrap()
    } catch (err) {
      console.log(err);
    }
  }
  
  const handleFindUser = useMemo(() => {
      return debounce(async (value) => {
          if(!value) return;
          try {
              await triggerFindUser(value).unwrap();
          } catch (err) {
            console.log(err);
          }
      }, 800);
  }, [triggerFindUser]);

  useEffect(() => {
      handleFindUser(value);
    }, [value, handleFindUser]);

  //   cleanup
  useEffect(() => {
      return () => {
          handleFindUser.cancel();
      };
  }, [handleFindUser, value]);

  return (
    <Dialog>
      <DialogTrigger className="hover:bg-amber-100 p-2 rounded-lg"><i className="fa-solid fa-user-plus"></i></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tìm kiếm bạn bè.</DialogTitle>
        </DialogHeader>
            <Input value={value} onChange={(e)=> setValue(e.target.value)} type="text" autoComplete="name" placeholder="Tên người dùng"/>
            {isLoading && (<span className="text-sm text-gray-500">Đang tìm...</span>)}
            {!isLoading && isError && <span className="text-red-500 text-sm">{error?.data?.message || "Có lỗi xảy ra"}</span>}
            {!isLoading && !isError && data?.length === 0 &&  <span className="text-red-500 text-sm">Không tìm thấy</span>}
            {data && data.map((user)=> {
              return (
              <div key={user.id}
              onClick={() => setActive(user.id)}
              className={`cursor-pointer hover:bg-amber-50 px-3 py-3
              ${active === user.id ? "bg-amber-100" : ""}
              `}>
                  <p>{user.name || "undefined"} </p>
                  <p>{user.email}</p>
              </div>
              )
            })}
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <button onClick={() => {
              setActive(null)
              setValue("")
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button disabled={isLoading}
            onClick={() => handleAdd(active)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {isLoading ? "Đang tìm..." : "Chat với người dùng này"}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default IconFriend;
