export default function PhoneBookListLayout({ icon, title, subtitle, count, children }) {
    return (
        <div>
            <header className="flex items-center p-5 mb-5">
                <i className={`fa-solid ${icon}`} />
                <h2 className="font-bold">{title}</h2>
            </header>
            <div className="bg-gray-200 p-5 flex flex-col gap-5">
                <div>{subtitle} ({count})</div>
                {count > 0 && <div className="p-3 rounded-sm bg-white">{children}</div>}
            </div>
        </div>
    )
}