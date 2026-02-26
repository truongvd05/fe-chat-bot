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

function NavigationRall({ setType }) {
    const {theme, setTheme} = useTheme()
return (
    <>
        <div className="flex flex-col gap-2">
            <NavIcon icon="fa-regular fa-comment" onClick={() => setType("chat")}/>
            <NavIcon icon="fa-brands fa-bots" onClick={() => setType("bots")}/>
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
                    <DropdownMenuItem>
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