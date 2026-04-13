import DropDownText from "./DropDownText"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NavIcon from "./NavIcon"
import { useTheme } from "@/contexts/ThemeContext"
import { useNavigate } from "react-router-dom"
import { useLogoutMutation } from "@/feature/User/userApi"
import { useSocket } from "@/contexts/SocketContext"
import { useDispatch } from "react-redux"
import { logOut } from "@/feature/User/userSlice"
import { disconnectSocket } from "@/socket/socket"
import logger from "@/utils/logger"

function NavigationRall({ type }) {
    const socket = useSocket();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {theme, setTheme} = useTheme()
    const [ logoutApi, {isLoading, error}] = useLogoutMutation()

    const refresh_token = localStorage.getItem("refresh_token")

    const handleLogout = async () => {
        if(!refresh_token) return
        try {
            disconnectSocket()
            await logoutApi().unwrap()
            dispatch(logOut());
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            navigate("/login")
        } catch (err) {
            logger.log(err);
        }
    }

    const handleGitHub = () => {
        window.open("https://github.com/truongvd05", "_blank");
    }
    
return (
    <>
        <div className="flex flex-col gap-2">
            <NavIcon icon="fa-regular fa-comment" active={type === "chat"}
            onClick={() => { navigate("/chat") }}/>
            <NavIcon icon="fa-brands fa-bots" active={type === "bots"}
            onClick={()  => { navigate("/bots") }}/>
        </div>  
        <div className="flex flex-col gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <NavIcon icon="fa-solid fa-gear"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                        {theme === "light" ? "dark" : "light"}
                    </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout}>
                        <DropDownText text="Log out" red>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </DropDownText>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </>
)
}

export default NavigationRall