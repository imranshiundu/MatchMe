import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon';
import { formatDistanceToNow } from 'date-fns';

interface ChatPreview {
    chatId: number;
    participantId: number;
    participantName: string;
    participantPicture: string;
    lastMessage: string;
    lastActivity: string;
    participantOnline: boolean;
    participantBio: string;
}

function Messages() {
    const { token } = useAuth();
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch('http://localhost:8085/chats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setChats(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, [token]);

    return (
        <div className="max-w-5xl mx-auto w-full px-6 py-10 animate-fade-in">
            <div className="mb-16">
                <h1 className="text-white text-5xl font-black tracking-tighter">Inbox</h1>
                <p className="text-[#5a6a6a] text-sm font-medium mt-4 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#C0FF00] rounded-full shadow-[0_0_8px_#C0FF00]"></span>
                    Your conversations are private and end-to-end encrypted
                </p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-[#1C1B1B] border border-[#313030]/20 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : chats.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {chats.map((chat) => (
                        <Link
                            key={chat.chatId}
                            to={`/connections/chat/${chat.participantId}`}
                            className="flex items-center gap-6 py-6 border-b border-[#313030]/20 hover:bg-[#1C1B1B]/10 transition-all group px-4"
                        >
                            <div className="relative flex-shrink-0">
                                <img
                                    src={chat.participantPicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.participantName}`}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-all"
                                    alt={chat.participantName}
                                />
                                {chat.participantOnline && (
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#C0FF00] border-4 border-[#121212] rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1.5">
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#C0FF00] transition-colors">
                                        {chat.participantName}
                                    </h3>
                                    <span className="text-[10px] font-bold text-[#5a6a6a] uppercase tracking-widest mt-1">
                                        {chat.lastActivity ? formatDistanceToNow(new Date(chat.lastActivity), { addSuffix: true }) : ''}
                                    </span>
                                </div>
                                <p className="text-[#adaaaa] text-sm truncate font-medium">
                                    {chat.lastMessage || chat.participantBio || 'Start a conversation...'}
                                </p>
                            </div>
                            <div className="flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon name="connect-icon" size={20} className="text-[#C0FF00]" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-24 px-8 text-center bg-transparent">
                    <div className="w-24 h-24 bg-[#1C1B1B] border border-[#313030]/30 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                        <Icon name="message-icon" size={40} className="text-[#313030]" />
                    </div>
                    <h2 className="text-white text-2xl font-black mb-4">No conversations yet</h2>
                    <p className="text-[#5a6a6a] text-sm font-medium max-w-sm mx-auto mb-12 leading-relaxed">
                        Find people on the platform and start a discussion about your favorite tech stack.
                    </p>
                    <button
                        onClick={() => window.location.href = '/match'}
                        className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#C0FF00] text-[#121212] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#A5DB00] transition-all shadow-xl active:scale-95"
                    >
                        Explore People
                    </button>
                </div>
            )}
        </div>
    );
}

export default Messages;
