import {
  Dialog,
  DialogContent,
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

import { selectUser } from "@/feature/User/userSelector"
import { useState } from "react"
import { useSelector } from "react-redux"

function MemberModal({ members, open, onOpenChange }) {
    const {user} = useSelector(selectUser)
    const [keyword, setKeyword] = useState("")
    const isAdmin = members?.some( m => m.userId === user.id && m.role === "ADMIN")
    const filteredMembers = members ?.filter(m => !m.leftAt)?.filter(m =>
      m.user.name.toLowerCase().includes(keyword.toLowerCase())
    )
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
        </DialogHeader>
        <Input value={keyword} onChange={(e)=> setKeyword(e.target.value)} placeholder="Tìm thành viên"/>
        <div className="space-y-3 max-h-100 overflow-y-auto overflow-x-hidden">
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
                          onClick={() => onKick(m.userId)}
                        >
                          Kick khỏi nhóm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )
            })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MemberModal