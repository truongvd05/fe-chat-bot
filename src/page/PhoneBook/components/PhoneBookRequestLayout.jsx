export default function PhoneBookRequestLayout({ icon, title, children }) {
    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <header className="flex items-center p-5 mb-5">
                <i className={`fa-solid ${icon}`} />
                <h2 className="font-bold">{title}</h2>
            </header>
            <div className="bg-gray-200 p-5 flex flex-col gap-5 h-full">
                <div className="p-3 rounded-sm ">{children}</div>
            </div>
        </div>
    )
}