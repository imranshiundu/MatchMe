import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatView from '../components/chat/ChatView.tsx';
import { useFetchUserDetails } from '../hooks/useFetchUserDetails';
import { websocketService } from '../services/websocketService.ts'
import { useFetchChatDetails } from '../hooks/useFetchChatDetails.tsx';

function Chat() {
    const { userId } = useParams<{ userId: string }>();
    const [message, setMessage] = useState<string>('')
    const { chat } = useFetchChatDetails(userId);
    console.log(chat.chatId);
    const { userData, loading, error } = useFetchUserDetails(userId);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!userData) {
        return <div>No user data found</div>;
    }

    const handleSendMessage = () => {
        if (!message.trim()) return;
        const SendChatDTO = {
            receiverId: userId,
            content: message
        }
        websocketService.send("/chat.send", SendChatDTO);
        setMessage('');
    }

    return (
        <div className={'flex flex-col bg-[#313030] rounded-xl w-full h-full'}>
            <header className={'bg-[#1C1B1B] rounded-t-xl h-12 py-2 flex items-center'}>
                <button className={'px-3 py-1 inline hover:text-[#CCC5B9] cursor-pointer'}>[X]</button>
                <img
                    className={'h-8 w-8 rounded-sm object-cover border-2 border-[#FFFCF2] inline'}
                    src={userData.imageUrl}
                    alt="Profile"
                />
                <p className={'px-3 py-1 text-xl inline'}>{userData.nickname}</p>
                <button className={'px-3 py-1 inline float-right cursor-pointer hover:text-[#ff7351]'}>[unmatch]</button>
            </header>

            <div className={'flex-1 overflow-auto'}>
                <ChatView/>
            </div>

            <footer className={'bg-[#1C1B1B] rounded-b-xl h-15 flex justify-center'}>
                <div className={'bg-[#403D39] rounded-xl h-10 mt-3'}>
                    <input
                        type={'text'}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        className={'bg-[#403D39] ml-3 mt-2 w-200 outline-none'}
                        placeholder={'write your message here'}/>
                    <button
                        onClick={() => handleSendMessage()}
                        className={'mr-3 cursor-pointer hover:text-[#CCC5B9]'}>[send]</button>
                </div>
            </footer>
        </div>
    )
}

export default Chat;