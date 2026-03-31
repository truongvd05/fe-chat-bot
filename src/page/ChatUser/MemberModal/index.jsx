import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { selectUser } from "@/feature/User/userSelector"
import { useState } from "react"
import { useSelector } from "react-redux"

function MemberModal({ members, open, onOpenChange, onKick }) {
  const {user} = useSelector(selectUser)
  const [keyword, setKeyword] = useState("")
  const [openLeave, setOpenLeave] = useState(false)

  const isAdmin = members?.some( m => m.userId === user.id && m.role === "ADMIN")
  
  const filteredMembers = members?.filter(m =>
    m.user?.name?.toLowerCase().includes(keyword.toLowerCase())
  )

  const adminCount = members?.filter(m => m.role === "ADMIN").length

  const isOnlyAdmin = isAdmin && adminCount === 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Danh sách thành viên trong nhóm
        </DialogDescription>
        <Input value={keyword} onChange={(e)=> setKeyword(e.target.value)} placeholder="Tìm thành viên"/>
        <div className="space-y-3 max-h-75 overflow-y-auto overflow-x-hidden">
          {filteredMembers?.map(m => {
              const isMe = m.userId === user.id
              return (
                <div key={m.userId} className="flex items-center gap-3">
                  <div className="flex-1 flex gap-5 items-center">
                    <p className="font-medium">{m.user.name}</p>
                    {isMe && <p className="text-sm opacity-70">Bạn</p>}
                  </div>

                  <span className="text-sm text-gray-500">
                    {m.role}
                  </span>
                  {isAdmin && !isMe && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <i className="fa-solid fa-ellipsis cursor-pointer px-2"></i>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {m.role !== "ADMIN" && (
                          <DropdownMenuItem
                            onClick={() => onPromote(m.userId)}
                          >
                            Thăng làm Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => onKick([m.userId])}
                        >
                          Kick khỏi nhóm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )
            })}
            <div className="flex items-center justify-center">
                  <span onClick={() => {
                        if (isOnlyAdmin) {
                          alert("Bạn là admin duy nhất, không thể rời nhóm")
                          return;
                        }
                        setOpenLeave(true)
                      }}
                    className="text-red-400 cursor-pointer hover:bg-amber-100 p-2 rounded-2xl">
                    Rời nhóm
                  </span>
            </div>
               <AlertDialog open={openLeave} onOpenChange={setOpenLeave}>
                <AlertDialogTrigger asChild>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bạn chắc chắn muốn rời nhóm?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Bạn sẽ phải được mời lại để tham gia nhóm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Rời nhóm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MemberModal