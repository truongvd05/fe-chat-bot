import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCreateBotConversationMutation } from "@/feature/Conversation/conversationApi";


function IconNewBots() {
  const [active, setActive] = useState(null)
  const [value, setValue] = useState("")
  const [ createDirectConversation, {isLoading, error}] = useCreateBotConversationMutation()

  const handleCreate = async (title) => {
    try {
      const res = await createDirectConversation({title}).unwrap()
      console.log(res);
      
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="hover:bg-amber-100 p-2 rounded-lg">
        <i class="fa-solid fa-plus"></i>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo đoạn chat mới</DialogTitle>
          <DialogDescription>
             Đặt tên cho cuộc hội thoại
          </DialogDescription>
        </DialogHeader>
            <Input value={value} onChange={(e)=> setValue(e.target.value)}
            required
            type="text" autoComplete="name"
            placeholder="Tên cuộc hội thoại"/>
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
            <Button  onClick={() => handleCreate(active)}
            disabled={!value.trim()}
            variant="outline">Tạo mới</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default IconNewBots;
