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
import { useEffect, useRef, useState } from "react";
import logger from "@/utils/logger";


function MemberSelectModal({trigger, title, data, onSearch, onSubmit, loading, error, reset}) {
    const [name, setName] = useState("")
    const [value, setValue] = useState("")
    const debounceRef = useRef()
    const [selectedUser, setSelectedUser] = useState(new Map())

    const handleSubmit = async () => {
        const memberIds  = Array.from(selectedUser.keys());
        if (memberIds.length === 0) return;
        try {
            await onSubmit({name, memberIds})
        } catch (err) {
            logger.log(err);
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

    useEffect(() => {
        debounceRef.current = debounce(async(value) => {
            if(!value.trim()) return
            try {
                await onSearch(value);
            } catch (err) {
                logger.log(err);
            }
        }, 800)
        return () => {
            debounceRef.current.cancel()
        }
    }, [onSearch])

    useEffect(() => {
        debounceRef.current(value);
    }, [value]);

    const resetState = () => {
        setValue("");
        setName("");
        setSelectedUser(new Map());
        reset();
    };

  return (
    <Dialog onOpenChange={(open) => {
                if (!open) {
                    resetState();
                }
            }}>
        <DialogTrigger className="hover:bg-amber-100 p-2 rounded-lg">
            {trigger}
        </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || "Thêm thành viên"}</DialogTitle>
        </DialogHeader>
            {title && <Input value={name} onChange={(e)=> setName(e.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Nhập tên nhóm..."/>}
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
            {loading && (<span className="text-sm text-gray-500">Đang tìm...</span>)}
            {!loading && error && <span className="text-red-500 text-sm">{error?.data?.message || "Có lỗi xảy ra"}</span>}
            {!loading && !error && data?.length === 0 &&  <span className="text-red-500 text-sm">Không tìm thấy</span>}
            <div className="overflow-y-auto max-h-70">
                {data && data.map((user)=> {
                  return (
                  <div key={user.id}
                  onClick={() => toggleUser(user)}
                  className={`cursor-pointer hover:bg-amber-50 px-3 py-3
                    ${selectedUser.has(user.id) ? "bg-gray-300" : ""}
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
          {loading && <p>Đang tìm...</p>}
          <DialogClose asChild>
            <button disabled={loading || selectedUser.size === 0}
                onClick={handleSubmit}
                className={`px-4 py-2
                ${loading || selectedUser.size === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"}`}>
              {title || "thêm"}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MemberSelectModal;
