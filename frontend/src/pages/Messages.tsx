import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon';

export type ChatItemDTO = {
    chatId: number;
    participantId: number;
    participantName: string;
    participantPicture: string;
    participantOnline: boolean;
    lastMessage: string;
    lastActivity: string;
    unreadCount: number;
};

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
        <div className="max-w-4xl mx-auto w-full px-4 py-8">
            <div className="flex flex-col gap-8 mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-white text-4xl font-black uppercase tracking-tighter">Messages</h1>
                        <p className="text-[#adaaaa] text-sm mt-1 font-mono">// direct encrypted communication</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-8 h-8 border-4 border-[#C0FF00] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[#adaaaa] text-xs font-mono tracking-widest uppercase">Opening channels...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-[#3a1f1f] p-4 rounded-full mb-4">⚠️</div>
                        <p className="text-[#ff7351] font-bold">Sync Error</p>
                        <p className="text-[#adaaaa] text-xs mt-1">{error}</p>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                        <div className="bg-[#252422] p-6 rounded-3xl mb-6">
                            <Icon name="message-icon" size={40} />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">Inboxes are empty</h3>
                        <p className="text-[#adaaaa] max-w-xs text-sm mb-8">Connect with other developers through Discover to start a conversation.</p>
                        <Link to="/match" className="px-6 py-3 bg-[#C0FF00] text-[#121212] rounded-xl font-bold hover:bg-[#D8FF80] transition-all active:scale-95">
                            Start Discovering
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-[#313030]">
                        {chats.map((chat) => (
                            <Link 
                                key={chat.chatId} 
                                to={`/connections/chat/${chat.participantId}`}
                                className="flex items-center gap-4 p-4 sm:p-6 hover:bg-[#252422] transition-all group relative"
                            >
                                {chat.unreadCount > 0 && (
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#C0FF00] rounded-r-full" />
                                )}
                                
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={chat.participantPicture || '/favicon.svg'} 
                                        alt={chat.participantName}
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-colors shadow-lg"
                                    />
                                    {chat.participantOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C0FF00] border-4 border-[#1C1B1B] rounded-full"></div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C0FF00] transition-colors truncate">
                                            {chat.participantName}
                                        </h3>
                                        <span className="text-[10px] sm:text-xs text-[#5a6a6a] font-mono whitespace-nowrap ml-2">
                                            {chat.lastActivity ? new Date(chat.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                    <p className={`truncate text-sm ${chat.unreadCount > 0 ? 'text-[#C0FF00] font-bold' : 'text-[#adaaaa]'}`}>
                                        {chat.lastMessage || 'Open channel to start chatting'}
                                    </p>
                                </div>
                                
                                {chat.unreadCount > 0 && (
                                    <div className="flex-shrink-0 bg-[#C0FF00] text-[#121212] text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg shadow-[0_0_10px_rgba(192,255,0,0.3)]">
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
