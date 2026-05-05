import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { websocketService } from '../services/websocketService.ts';
import ChatView from '../components/chat/ChatView.tsx';
import Icon from '../components/Icon.tsx';

function Chat() {
    const { userId: receiverId } = useParams<{ userId: string }>();
    const { token, userEmail } = useAuth();
    const [message, setMessage] = useState('');
    const [chatId, setChatId] = useState<number | null>(null);
    const [userDetails, setUserDetails] = useState<any>({});
    const [isOnline, setIsOnline] = useState(false);
    
    // Typing state logic
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isTypingLocal, setIsTypingLocal] = useState(false);

    useEffect(() => {
        async function getChat() {
            try {
                const response = await fetch(`http://localhost:8085/chats/initiate/${receiverId}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setChatId(data.chatId);
                    setUserDetails({
                        nickname: data.participantName,
                        imageUrl: data.participantPicture
                    });
                    setIsOnline(data.participantOnline);
                }
            } catch (error) {
                console.error("Failed to initiate chat:", error);
            }
        }
        if (token && receiverId) getChat();
    }, [token, receiverId]);

    const sendTypingStatus = (typing: boolean) => {
        if (chatId) {
            websocketService.sendTyping(chatId, typing);
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        
        if (!isTypingLocal) {
            setIsTypingLocal(true);
            sendTypingStatus(true);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        
        typingTimeoutRef.current = setTimeout(() => {
            setIsTypingLocal(false);
            sendTypingStatus(false);
        }, 2000);
    };

    const handleSendMessage = () => {
        if (!message.trim() || !chatId) return;
        
        websocketService.sendMessage(chatId, message.trim());
        setMessage('');
        
        // Reset typing status immediately on send
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setIsTypingLocal(false);
        sendTypingStatus(false);
    };

    if (!chatId) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full bg-[#121212]">
                <div className="w-12 h-12 border-2 border-[#C0FF00] border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[#5a6a6a] text-[10px] font-black uppercase tracking-[0.3em]">Initializing Channel...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] w-full bg-[#121212] md:border-x border-[#313030] overflow-hidden animate-fade-in">
            {/* Chat Header */}
            <header className="flex items-center gap-4 px-6 py-4 bg-[#1C1B1B]/80 backdrop-blur-md border-b border-[#313030] z-10 flex-shrink-0">
                <Link to="/messages" className="p-2 -ml-2 text-[#5a6a6a] hover:text-[#C0FF00] transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                
                <div className="relative flex-shrink-0">
                    <img
                        className="h-11 w-11 rounded-2xl border-2 border-[#313030] shadow-2xl object-cover group-hover:border-[#C0FF00] transition-all"
                        src={userDetails.imageUrl || '/favicon.svg'}
                        alt={userDetails.nickname}
                    />
                    {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C0FF00] border-4 border-[#1C1B1B] rounded-full shadow-[0_0_10px_#C0FF00]" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <Link to={`/match/${receiverId}`} className="text-lg font-black text-white hover:text-[#C0FF00] transition-colors truncate block tracking-tight">
                        {userDetails.nickname}
                    </Link>
                    <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isOnline ? 'text-[#C0FF00]' : 'text-[#5a6a6a]'}`}>
                            {isOnline ? 'Direct Link' : 'Standby'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center">
                    <Link to={`/match/${receiverId}`} className="p-3 text-[#5a6a6a] hover:text-[#C0FF00] hover:bg-[#252422] rounded-2xl transition-all">
                        <Icon name="view-profile-icon" size={20} />
                    </Link>
                </div>
            </header>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-hidden relative bg-[#121212]">
                <ChatView chatId={chatId} receiverId={receiverId} />
            </div>

            {/* Chat Input */}
            <footer className="p-5 bg-[#1C1B1B] border-t border-[#313030]">
                <div className="flex items-end gap-4 max-w-5xl mx-auto">
                    <div className="flex-1 relative">
                        <textarea
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Input command or message..."
                            className="w-full bg-[#121212] border border-[#313030] rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#C0FF00] focus:ring-1 focus:ring-[#C0FF00] transition-all resize-none max-h-32 min-h-[56px] placeholder-[#5a6a6a] font-medium"
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-[#C0FF00] text-[#121212] p-4 rounded-2xl disabled:opacity-20 hover:bg-[#A5DB00] transition-all shadow-[0_0_20px_rgba(192,255,0,0.2)] active:scale-95 group"
                    >
                        <Icon name="connect-icon" size={24} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default Chat;