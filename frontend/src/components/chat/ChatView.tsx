import ChatBubble from '../chat/ChatBubble.tsx';
import { useFetchChatHistory } from '../../hooks/useFetchChatHistory.tsx'


type Message = {
    id: number;
    chatId: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    isRead: boolean;
    fromSender: boolean;
};

function ChatView({chatId, userId} : {chatId: number | null; userId: number | null}) {
    const { messages, loading, error } = useFetchChatHistory(chatId);
    // TODO remove chatId check when fixed
    if (!chatId) {
        return <div>Missing Chat ID</div>;
    }
    if (loading) {
        return <div>Loading messages...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    const formattedMessages = messages.map((msg) => ({
        ...msg,
        fromSender: msg.senderId === currentUserId,
    }));

    return (
        <div className={'flex flex-col'}>
            {formattedMessages.map((msg: Message) => (
                <ChatBubble
                    key={msg.id}
                    message={msg.content}
                    fromSender={msg.fromSender}
                />
            ))}
        </div>
    );
}

export default ChatView;