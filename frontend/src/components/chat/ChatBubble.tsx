function ChatBubble({message, fromSender}) {
    return (
        <div
            className={`${fromSender ? 'max-w-1/2 bg-[#D8FF80] text-[#141F00] ml-auto mr-5 my-5 px-5 py-2 rounded-xl rounded-br-none' : 'max-w-1/2 bg-[#1c1b1b] mr-auto ml-5 my-5 px-5 py-2 rounded-xl rounded-tl-none'}`}
        >{message}</div>
    )
}

export default ChatBubble;