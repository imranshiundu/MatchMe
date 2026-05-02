import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatView from '../components/chat/ChatView.tsx';
import { useFetchUserDetails } from '../hooks/useFetchUserDetails';
import { websocketService } from '../services/websocketService';
import { useFetchChatDetails } from '../hooks/useFetchChatDetails.tsx';

function Chat() {
    const { userId } = useParams<{ userId: string }>();
    const receiverId = Number(userId);

    const [userInput, setUserInput] = useState('');

    const { chats, loading: chatsLoading, error: chatsError } = useFetchChatDetails();
    const { userDetails, loading: userLoading, error: userError } = useFetchUserDetails(receiverId);

    const currentChat = useMemo(
        () => chats.find((chat) => chat.participantId === receiverId) ?? null,
        [chats, receiverId]
    );

    const chatId = currentChat?.chatId ?? null;

    if (!userId || Number.isNaN(receiverId)) return <div>Invalid user</div>;
    if (userLoading || chatsLoading) return <div>Loading...</div>;
    if (userError || chatsError) return <div>Error: {userError || chatsError}</div>;
    if (!userDetails) return <div>No user data found</div>;

    const handleSendMessage = () => {
        if (!userInput.trim()) return;

        const sendChatDTO = {
            receiverId,
            content: userInput,
        };

        websocketService.send('/app/chat.send', sendChatDTO);
        setUserInput('');
    };

    return (
        <div className="flex h-[100dvh] w-full flex-col md:h-full md:rounded-xl">
            <header className="flex min-h-14 items-center gap-3 px-3 py-2 md:rounded-b-xl">
                <img
                    className="h-9 w-9 shrink-0 rounded-md border-2 border-[#FFFCF2] object-cover"
                    src={userDetails.imageUrl}
                    alt="Profile"
                />
                <p className="min-w-0 flex-1 truncate text-base sm:text-lg md:text-xl">
                    {userDetails.nickname}
                </p>
            </header>

            <div className="flex-1 min-h-0 px-2 sm:px-3 pb-2">
                <div className="h-full rounded-xl overflow-hidden bg-[#1c1b1b] border-2 border-[#313030]">
                    <div className="h-full overflow-y-auto">
                        <ChatView chatId={chatId} />
                    </div>
                </div>
            </div>

            <footer className="w-full px-2 py-2 md:rounded-t-xl">
                <div className="flex items-center gap-2 rounded-xl bg-[#403D39] px-3 py-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#b0aeac] sm:text-base"
                        placeholder="Write your message here"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="shrink-0 cursor-pointer px-2 py-1 text-sm hover:text-[#CCC5B9] sm:text-base"
                    >
                        [send]
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default Chat;