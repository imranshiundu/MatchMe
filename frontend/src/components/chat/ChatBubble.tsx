function ChatBubble({ message, fromSender, timestamp }: { message: string; fromSender: boolean; timestamp: string }) {
    const date = new Date(timestamp);
    const formattedTime = new Intl.DateTimeFormat('en-GB', {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);

    return (
        <div className={`flex w-full mb-4 px-4 ${fromSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col ${fromSender ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                <div
                    className={`
                        px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words
                        ${fromSender
                            ? 'bg-[#C0FF00] text-[#121212] rounded-tr-none font-medium'
                            : 'bg-[#252422] text-white border border-[#313030] rounded-tl-none'}
                    `}
                >
                    {message}
                </div>
                
                <span className="mt-1.5 px-1 text-[10px] font-mono text-[#5a6a6a] uppercase tracking-tighter">
                    {formattedTime}
                </span>
            </div>
        </div>
    );
}

export default ChatBubble;