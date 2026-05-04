import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon';
import { ChatItemDTO } from '../hooks/useFetchChatDetails';

function Messages() {
    const { token } = useAuth();
    const [chats, setChats] = useState<ChatItemDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8085/chats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load messages');
                }
                
                const data = await response.json();
                setChats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchChats();
        }
    }, [token]);

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto p-4 sm:p-6 w-full">
            <h1 className="text-[#C0FF00] text-3xl font-bold mb-6 tracking-tight">Messages</h1>
            
            <div className="bg-[#1c1b1b] border-2 border-[#313030] rounded-2xl overflow-hidden shadow-lg flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-[#adaaaa] animate-pulse">Loading messages...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-[#ff7351]">{error}</p>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-60 text-center px-4">
                        <div className="bg-[#252422] p-4 rounded-full mb-4">
                            <Icon name="message-icon" size={40} />
                        </div>
                        <p className="text-[#D8FF80] text-xl font-semibold mb-2">No messages yet</p>
                        <p className="text-[#adaaaa]">Match with someone and start a conversation!</p>
                        <Link to="/match" className="mt-6 px-6 py-2 bg-[#C0FF00] text-[#121212] rounded-lg font-bold hover:bg-[#A2D800] transition-colors">
                            Find Matches
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-[#313030]">
                        {chats.map((chat) => (
                            <Link 
                                key={chat.chatId} 
                                to={`/connections/chat/${chat.participantId}`}
                                className="flex items-center p-4 hover:bg-[#252422] transition-colors group relative"
                            >
                                <div className="relative">
                                    <img 
                                        src={chat.participantPicture || '/favicon.svg'} 
                                        alt={chat.participantName}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-colors"
                                    />
                                    {chat.participantOnline && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#C0FF00] border-2 border-[#1c1b1b] rounded-full"></div>
                                    )}
                                </div>
                                
                                <div className="ml-4 flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-[#D8FF80] font-bold truncate text-lg">{chat.participantName}</h3>
                                        <span className="text-xs text-[#adaaaa] whitespace-nowrap ml-2">
                                            {chat.lastActivity ? new Date(chat.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                    <p className={`truncate text-sm ${chat.unreadCount > 0 ? 'text-[#C0FF00] font-semibold' : 'text-[#adaaaa]'}`}>
                                        {chat.lastMessage || 'Start a conversation'}
                                    </p>
                                </div>
                                
                                {chat.unreadCount > 0 && (
                                    <div className="ml-3 bg-[#C0FF00] text-[#121212] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                        {chat.unreadCount}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;
