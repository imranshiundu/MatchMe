function ChatBubble({ content, isOwn, timestamp }: { content: string, isOwn: boolean, timestamp: string }) {
    return (
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-1`}>
            <div
                className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-3xl text-sm font-medium leading-relaxed shadow-xl transition-all ${
                    isOwn
                        ? 'bg-[#C0FF00] text-[#121212] rounded-tr-none'
                        : 'bg-[#1C1B1B] text-white border border-[#313030] rounded-tl-none'
                }`}
            >
                {content}
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter text-[#5a6a6a] mt-1.5 px-1 font-mono">
                {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
}

export default ChatBubble;