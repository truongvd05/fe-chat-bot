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
import { useLogoutMutation, useToggleAiSuggestMutation } from "@/feature/User/userApi"
import { useDispatch, useSelector } from "react-redux"
import { logOut, updateUser } from "@/feature/User/userSlice"
import { disconnectSocket } from "@/socket/socket"
import logger from "@/utils/logger"
import UserAvatar from "@/components/UserAvatar"
import { selectUser } from "@/feature/User/userSelector"
import { toast } from "sonner"
import { conversationApi } from "@/feature/Conversation/conversationApi"
import { messageApi } from "@/feature/Message/messageApi"

function NavigationRall() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {theme, setTheme} = useTheme()
    const {user} = useSelector(selectUser)
    
    const [ logoutApi, {isLoading, error}] = useLogoutMutation()
    const [toggetAi] = useToggleAiSuggestMutation()

    const type = location.pathname.split("/")[1];

    const handleLogout = async () => {
        try {
            disconnectSocket()
            await logoutApi().unwrap()
            dispatch(logOut());
            dispatch(conversationApi.util.resetApiState())
            navigate("/login")
        } catch (err) {
            logger.log(err);
        }
    }

    const handleToggerAi = async (aiSuggest) => {
        try {
            await toggetAi(aiSuggest).unwrap()
            dispatch(updateUser({ aiSuggest }));
            toast.success(aiSuggest ? "Đã bật gợi ý AI" : "Đã tắt gợi ý AI")
        } catch (err) {
            logger.error(err)
            toast.error("lỗi không xác định")
        }
    }

    const handleGitHub = () => {
        window.open("https://github.com/truongvd05", "_blank");
    }
    
return (
    <>
        <div className="flex flex-col gap-2">
            <UserAvatar /> 
            <NavIcon icon="fa-regular fa-comment" active={type === "chat"}
            onClick={() => { navigate("/chat") }}/>
            <NavIcon icon="fa-regular fa-address-book"  active={type === "phone-book"}
            onClick={()  => { navigate("/phone-book") }}/>
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
                    <DropdownMenuItem onClick={() => {handleToggerAi(!user?.aiSuggest)}}>
                        {user?.aiSuggest ? "Tắt gợi ý từ AI" : "Bật gợi ý từ AI"}
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