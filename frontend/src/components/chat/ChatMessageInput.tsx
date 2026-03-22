function ChatMessageInput () {
    return (
        <footer className='flex w-screen absolute bottom-0 h-10 bg-[#252422] justify-center items-center gap-3'>
            <input type='text' placeholder='message' className='bg-[#403D39] py-1 rounded-2xl'/>
            <button type='submit' className='cursor-pointer bg-[#EB5E28] px-2 py-1 rounded-2xl font-bold'>Send</button>
        </footer>
    )
}

export default ChatMessageInput