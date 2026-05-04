import { useState, useEffect, useMemo, useRef } from 'react';
import ChatBubble from '../chat/ChatBubble.tsx';
import { useFetchChatHistory } from '../../hooks/useFetchChatHistory.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { websocketService } from '../../services/websocketService';

type Message = {
    id: number;
    chatId: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    isRead: boolean;
};

function ChatView({ chatId, receiverId }: { chatId: number | null, receiverId: number }) {
    const { userId, token } = useAuth();
    const { messages, loading, error } = useFetchChatHistory(chatId);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const shouldScrollToBottomRef = useRef(true);

    const PAGE_SIZE = 20;

    useEffect(() => {
        setMessageHistory(messages ?? []);
        setPage(0);
        setHasMore((messages?.length ?? 0) === PAGE_SIZE);
        shouldScrollToBottomRef.current = true;
    }, [messages, chatId]);

    useEffect(() => {
        if (!chatId) return;

        websocketService.subscribeToChat(chatId, (_chatId, message) => {
            shouldScrollToBottomRef.current = true;
            setMessageHistory((prev) => {
                const exists = prev.some((m) => m.id === message.id);
                return exists ? prev : [...prev, message];
            });
        });

        return () => {
            websocketService.unsubscribe(`/topic/chat/${chatId}`);
        };
    }, [chatId]);

    useEffect(() => {
        websocketService.subscribeToTyping((typingUserId, typingStatus) => {
            if (Number(typingUserId) === Number(receiverId)) {
                setIsTyping(typingStatus);
            }
        });

        return () => {
            websocketService.unsubscribe('/user/queue/typing');
        };
    }, [receiverId]);

    useEffect(() => {
        if (shouldScrollToBottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageHistory, isTyping]);

    const loadOlderMessages = async () => {
        if (!chatId || !token || loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;

            const response = await fetch(
                `http://localhost:8085/chats/${chatId}/messages?page=${nextPage}&size=${PAGE_SIZE}&markAsRead=false`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to load older messages');

            const olderMessages: Message[] = await response.json();

            if (olderMessages.length === 0) {
                setHasMore(false);
                return;
            }
            if (olderMessages.length < PAGE_SIZE) {
                setHasMore(false);
            }

            // Save current scroll height to maintain position
            const container = scrollContainerRef.current;
            const scrollHeightBefore = container?.scrollHeight ?? 0;

            shouldScrollToBottomRef.current = false;
            setMessageHistory((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const uniqueOlder = olderMessages.filter((m) => !existingIds.has(m.id));
                return [...uniqueOlder, ...prev];
            });
            setPage(nextPage);

            // Maintain scroll position after update
            setTimeout(() => {
                if (container) {
                    container.scrollTop = container.scrollHeight - scrollHeightBefore;
                }
            }, 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMore(false);
        }
    };

    const formattedMessages = useMemo(
        () =>
            messageHistory.map((msg) => ({
                ...msg,
                fromSender: Number(msg.senderId) === Number(userId),
            })),
        [messageHistory, userId]
    );

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#C0FF00] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center p-6 text-center">
                <p className="text-[#ff7351] text-sm font-mono">ERR: {error}</p>
            </div>
        );
    }

    return (
        <div ref={scrollContainerRef} className="h-full overflow-y-auto pt-6 pb-2 scrollbar-thin scrollbar-thumb-[#313030] scrollbar-track-transparent">
            {hasMore && (
                <div className="flex justify-center mb-6">
                    <button
                        onClick={loadOlderMessages}
                        disabled={loadingMore}
                        className="px-4 py-1.5 rounded-full bg-[#313030] text-[10px] font-black uppercase tracking-widest text-[#adaaaa] hover:text-white hover:bg-[#403d39] transition-all disabled:opacity-50"
                    >
                        {loadingMore ? 'Loading History...' : 'Load Older Messages'}
                    </button>
                </div>
            )}

            {messageHistory.length === 0 && !isTyping && (
                <div className="h-full flex flex-col items-center justify-center px-10 text-center opacity-40">
                    <div className="w-16 h-16 bg-[#252422] rounded-3xl mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#C0FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-[#C0FF00] font-black uppercase tracking-widest text-[10px] mb-1">Encrypted Channel Active</p>
                    <p className="text-white text-xs">Say hello to start the conversation</p>
                </div>
            )}

            <div className="flex flex-col">
                {formattedMessages.map((msg) => (
                    <ChatBubble
                        key={msg.id}
                        message={msg.content}
                        fromSender={msg.fromSender}
                        timestamp={msg.timestamp}
                    />
                ))}
            </div>

            {isTyping && (
                <div className="flex items-center gap-2 px-6 py-2">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#C0FF00] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-[#C0FF00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-[#C0FF00] rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C0FF00]">Typing</span>
                </div>
            )}

            <div ref={bottomRef} className="h-2" />
        </div>
    );
}

export default ChatView;