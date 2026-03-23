import { selectUser } from "@/feature/User/userSelector";
import { useSelector } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";

function User() {
  const { user } = useSelector(selectUser);
  const navigate = useNavigate()
  return (
    <>
      <DropdownMenu className="right-0">
        <DropdownMenuTrigger asChild>
          <div className="flex gap-2 justify-end items-center mr-5 mt-2 text-lg cursor-pointer">
            <i className="fa-regular fa-user"></i>
            <p>{user.name}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default User;
