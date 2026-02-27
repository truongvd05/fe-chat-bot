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

import debounce from "lodash.debounce";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Input } from "@/components/ui/input";
import { useEffect, useMemo } from "react";
import { useFindUserQuery, useLazyFindUserQuery } from "@/feature/User/userApi";

const schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên bạn bè của bạn!"),
})
function AddFriend() {
  const {
      register,
      handleSubmit,
      setError,
      watch,
      clearErrors,
      formState: { errors },
  } = useForm({resolver: yupResolver(schema)});

  const [triggerFindUser, { data, isLoading }] = useLazyFindUserQuery();

    const namevalue = watch("name")

    const handleFindUser = useMemo(() => {
        return debounce(async (value) => {
            if(!value) return;
            try {
                clearErrors("name");
                await triggerFindUser(value).unwrap();
            } catch (err) {
                setError("name", {
                    type: "manual",
                    message: err?.data?.error || "Không tìm thấy người dùng",
                });
            }
        }, 800);
    }, [triggerFindUser, clearErrors, setError]);

    useEffect(() => {
        handleFindUser(namevalue);
        clearErrors("root")
      }, [namevalue, handleFindUser]);

    //   cleanup
    useEffect(() => {
        return () => {
            handleFindUser.cancel();
        };
    }, [handleFindUser, namevalue]);

  return (
    <Dialog>
      <DialogTrigger><i className="fa-solid fa-user-plus"></i></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>thêm bạn</DialogTitle>
          <DialogDescription>
             Nhập tên người dùng để tìm kiếm và gửi lời mời kết bạn.
          </DialogDescription>
        </DialogHeader>
            <Input type="text" autoComplete="name" placeholder="Tên người dùng" {...register("name", { required: true })}/>
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            {data && data.map((user)=> {
              return (
              <div key={user.id} className="cursor-pointer hover:bg-amber-50 px-3 py-3">
                  {user.email}
              </div>
              )
            })}
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
          </DialogClose>
          <button disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isLoading ? "Đang tìm..." : "Thêm"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddFriend;
