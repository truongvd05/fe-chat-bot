function ChatBox (){
    if (!conversationId) {
        return <div className="flex-1">Select a conversation</div>;
    }
    if (isLoading) return <p>Loading chat...</p>;
    return (
            <div className="flex-1 p-4">
                {data?.map((msg) => (
                    <div key={msg.id}>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
        );
}

export default ChatBox