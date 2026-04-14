import ChatBubble from '../chat/ChatBubble.tsx'

function ChatView({connectionName, isOnline}) {
    return (
        <div className={'flex flex-col bg-[#313030] rounded-xl w-full h-full'}>
            <header className={'bg-[#1C1B1B] rounded-t-xl h-12 py-2'}>
                <button className={'px-3 py-1 inline hover:text-[#CCC5B9] cursor-pointer'}>[X]</button>
                <p className={'px-3 py-1 text-xl inline'}>{connectionName}</p>
                <p className={`px-3 inline text-xs ${isOnline ? "text-[#eaffb8]" : "text-[#ff7351]"}`}>{isOnline ? 'ONLINE' : 'OFFLINE'}</p>
                <button className={'px-3 py-1 inline float-right cursor-pointer hover:text-[#ff7351]'}>[unmatch]</button>
            </header>
            <div className={'flex-1 flex flex-col'}>
                    <ChatBubble message={'hello'} fromSender={true}/>
                    <ChatBubble message={'world'} fromSender={false}/>
            </div>
            <footer className={'bg-[#1C1B1B] rounded-b-xl h-15 flex justify-center'}>
                <div className={'bg-[#403D39] rounded-xl h-10 mt-3'}>
                    <input type={'text'} className={'bg-[#403D39] ml-3 mt-2 w-200 outline-none'} placeholder={'write your message here'}/>
                    <button className={'mr-3 cursor-pointer hover:text-[#CCC5B9]'}>[send]</button>
                </div>
            </footer>
        </div>
    )
}

export default ChatView;