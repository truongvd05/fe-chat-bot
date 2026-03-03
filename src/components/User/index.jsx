import { selectUser } from "@/feature/User/userSelector";
import { useSelector } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DropDownText from "@/layouts/ChatLayout/Sidebar/NavigationRaill/DropDownText";
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
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DropDownText text="Log out" red>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </DropDownText>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default User;
