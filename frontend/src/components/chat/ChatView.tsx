import { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble.tsx';
import { websocketService } from '../../services/websocketService.ts';
import { useAuth } from '../../hooks/useAuth.tsx';

interface Message {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    timestamp: string;
}

function ChatView({ chatId, receiverId, currentUserId, onAddMessage }: { 
    chatId: number, 
    receiverId: string | number,
    currentUserId?: number,
    onAddMessage?: (addFn: (msg: Message) => void) => void
}) {
    const { token } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch(`http://localhost:8085/chats/${chatId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        }
        if (token && chatId) fetchHistory();
    }, [token, chatId]);

    // Expose addMessage to parent via callback so optimistic updates work
    useEffect(() => {
        if (onAddMessage) {
            onAddMessage((msg: Message) => {
                setMessages((prev) => {
                    // Avoid duplicates (server may echo back the same message)
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            });
        }
    }, [onAddMessage]);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribeMessage = websocketService.subscribeToMessages(chatId, (msg) => {
            setMessages((prev) => {
                // Avoid duplicates from optimistic + server echo
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });

        const unsubscribeTyping = websocketService.subscribeToTyping((typingData) => {
            if (typingData.chatId === chatId && typingData.userId === Number(receiverId)) {
                setIsTyping(typingData.isTyping);
            }
        });

        return () => {
            unsubscribeMessage();
            unsubscribeTyping();
        };
    }, [chatId, receiverId]);

    return (
        <div className="h-full overflow-y-auto px-4 md:px-8 py-8 no-scrollbar flex flex-col gap-1">
            <div className="flex flex-col gap-1.5 flex-1 min-h-0">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center select-none">
                        <div className="w-20 h-20 bg-[#1C1B1B] border border-[#313030]/30 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                            <span className="text-[#C0FF00] text-2xl font-black">!</span>
                        </div>
                        <h3 className="text-white text-xl font-black mb-2">Say Hello</h3>
                        <p className="text-[#5a6a6a] text-sm font-medium max-w-[250px]">Send the first message to start the conversation.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatBubble 
                            key={msg.id} 
                            content={msg.content} 
                            isOwn={msg.senderId !== Number(receiverId)} 
                            timestamp={msg.timestamp}
                        />
                    ))
                )}

                {isTyping && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#1C1B1B] border border-[#313030] rounded-2xl w-fit mt-2 animate-fade-in shadow-xl">
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 bg-[#C0FF00] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-[#C0FF00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-[#C0FF00] rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5a6a6a]">Typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}

export default ChatView;