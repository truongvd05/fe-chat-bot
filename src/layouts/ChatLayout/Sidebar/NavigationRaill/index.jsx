import DropDownText from "./DropDownText"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NavIcon from "./NavIcon"
import { useTheme } from "@/contexts/ThemeContext"
import { useNavigate } from "react-router-dom"
import { useLogoutMutation } from "@/feature/User/userApi"

function NavigationRall({ setType, type }) {
    const navigate = useNavigate()
    const {theme, setTheme} = useTheme()
    const [ logout, {isLoading, error}] = useLogoutMutation()

    const refresh_token = localStorage.getItem("refresh_token")

    const handleLogout = async () => {
        if(!refresh_token) return
        try {
            await logout().unwrap()
            localStorage.clear()
            navigate("/login")
        } catch (err) {
            console.log(err);
        }
    }
return (
    <>
        <div className="flex flex-col gap-2">
            <NavIcon icon="fa-regular fa-comment" active={type === "chat"}
            onClick={() => {
                setType("chat")
                navigate("/chat")
            }}/>
            <NavIcon icon="fa-brands fa-bots" active={type === "bots"}
            onClick={()  => {
                setType("bots")
                navigate("/bots")
            }}/>
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
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
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