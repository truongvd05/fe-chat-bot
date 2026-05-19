import { NavLink } from "react-router-dom"

const items = [
    { icon: "fa-user",       label: "Danh sách bạn bè",                  to: "/phone-book/friends" },
    { icon: "fa-users",      label: "Danh sách nhóm và cộng đồng",       to: "/phone-book/groups" },
    { icon: "fa-user-plus",  label: "Lời mời kết bạn",                   to: "/phone-book/friend-requests" },
    { icon: "fa-users-line", label: "Lời mời vào nhóm và cộng đồng",     to: "/phone-book/group-requests" },
]

export default function PhoneBookList() {
    return (
        <>
            {items.map((item) => (
                <NavLink to={item.to}
                className={({ isActive }) =>
                        `flex w-full items-center gap-2 p-2 rounded-lg
                        ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`
                    }
                    key={item.label}>
                    <i className={`fa-solid ${item.icon}`}></i>
                    <p className="text-sm">{item.label}</p>
                </NavLink>
            ))}
        </>
    )
}