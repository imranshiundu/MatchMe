function ChatBubble({message, fromSender, timestamp}) {
    const date = new Date(timestamp)
    const formattedDate = new Intl.DateTimeFormat('en-GB',{
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
    const formattedTime = Intl.DateTimeFormat('en-GB',{
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);

    return (
        <div className={`mt-4 flex flex-col ${fromSender ? 'items-end pr-4' : 'items-start pl-4'}`}>
            <div
                className={`
        max-w-[70%] px-4 py-2 rounded-xl shadow-sm break-words
        ${fromSender
                    ? 'bg-[#D8FF80] text-[#1c1b1b] rounded-br-sm'
                    : 'bg-[#313030] text-[#D8FF80] rounded-bl-sm'}
      `}
            >
                {message}
            </div>

            <p className={`mt-1 text-xs text-[#787776] ${fromSender ? 'text-right' : 'text-left'}`}>
                {fromSender ? <>{formattedTime} {formattedDate}</> : <>{formattedDate} {formattedTime}</>}
            </p>
        </div>
    );
}

export default ChatBubble;