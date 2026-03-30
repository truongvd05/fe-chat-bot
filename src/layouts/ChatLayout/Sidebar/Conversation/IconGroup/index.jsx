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
import { useCreateGroupConversationMutation } from "@/feature/Conversation/conversationApi";


function IconGroup() {
    const [triggerFindUser, { data, isLoading, isError, error }] = useLazyFindUserQuery();
    const [ createGroupConversation, {isLoading: createGruopLoading, error: createGroupError}] = useCreateGroupConversationMutation()
    const [name, setName] = useState("")
    const [value, setValue] = useState("")
    const [selectedUser, setSelectedUser] = useState(new Map())

    const handleCreateGroup = async () => {
        const memberIds  = Array.from(selectedUser.keys());
        if (memberIds.length === 0) return;
        try {
            await createGroupConversation({name, memberIds}).unwrap()
        } catch (err) {
        console.log(err);
        }
    }
  
    const toggleUser = (user) => {
        setSelectedUser((prev) => {
            const newMap = new Map(prev);
            if(newMap.has(user.id)) {
                newMap.delete(user.id);
            } else {
                newMap.set(user.id, user);
            }
            return newMap;
        })
    }
    const isSelected = (user) => {
        return selectedUser.has(user.id);
    };

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
      <DialogTrigger className="hover:bg-amber-100 p-2 rounded-lg">
        <i className="fa-solid fa-users"></i>
        </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo nhóm</DialogTitle>
        </DialogHeader>
            <Input name={name} onChange={(e)=> setName(e.target.value)} type="text" autoComplete="name" placeholder="Nhập tên nhóm..."/>
            {selectedUser.size > 0 ? <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(selectedUser.values()).map((user) => (
                    <div
                    key={user.id}
                    className="bg-gray-200 px-2 py-1 rounded flex items-center"
                    >
                        <span>{user.name}</span>
                        <span
                            className="ml-2 cursor-pointer"
                            onClick={() => toggleUser(user)}
                        >
                            ✕
                        </span>
                    </div>
                ))}
            </div> : "chưa chọn thành viên nào"}
            <Input value={value} onChange={(e)=> setValue(e.target.value)} type="text" autoComplete="name" placeholder="Nhập tên, email"/>
            {isLoading && (<span className="text-sm text-gray-500">Đang tìm...</span>)}
            {!isLoading && isError && <span className="text-red-500 text-sm">{error?.data?.message || "Có lỗi xảy ra"}</span>}
            {!isLoading && !isError && data?.length === 0 &&  <span className="text-red-500 text-sm">Không tìm thấy</span>}
            <div className="overflow-y-auto max-h-70">
                {data && data.map((user)=> {
                  return (
                  <div key={user.id}
                  onClick={() => toggleUser(user)}
                  className={`cursor-pointer hover:bg-amber-50 px-3 py-3
                    {selectedUser.has(user.id) ? "bg-gray-300" : ""}
                  `}>
                      <p>{user.name || "undefined"} </p>
                      <p>{user.email}</p>
                  </div>
                  )
                })}
            </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <button onClick={() => {
                setValue("")
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button disabled={createGruopLoading || selectedUser.size === 0}
                onClick={handleCreateGroup}
                className={`px-4 py-2
                ${createGruopLoading || selectedUser.size === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"}`}>
              {createGruopLoading ? "Đang tìm..." : "Tạo nhóm"}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default IconGroup;
