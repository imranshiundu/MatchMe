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

function ChatView({ chatId }: { chatId: number | null }) {
    const { userId, token } = useAuth();
    const { messages, loading, error } = useFetchChatHistory(chatId);
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const shouldScrollToBottomRef = useRef(true);

    useEffect(() => {
        setMessageHistory(messages ?? []);
        setPage(0);
        setHasMore((messages?.length ?? 0) > 0);
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
        if (shouldScrollToBottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageHistory]);

    const loadOlderMessages = async () => {
        if (!chatId || !token || loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;

            const response = await fetch(
                `http://localhost:8085/chats/${chatId}/messages?page=${nextPage}&size=20&markAsRead=false`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load older messages');
            }

            const olderMessages: Message[] = await response.json();

            if (olderMessages.length === 0) {
                setHasMore(false);
                return;
            }

            shouldScrollToBottomRef.current = false;
            setMessageHistory((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const uniqueOlder = olderMessages.filter((m) => !existingIds.has(m.id));
                return [...uniqueOlder, ...prev];
            });
            setPage(nextPage);
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

    if (loading) return <div>Loading messages...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col">
            {hasMore && (
                <button
                    onClick={loadOlderMessages}
                    disabled={loadingMore}
                    className="mx-auto my-3 px-4 py-2 rounded-lg bg-[#403D39] text-sm hover:bg-[#4a4642] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loadingMore ? 'Loading...' : 'Load older messages'}
                </button>
            )}

            {formattedMessages.map((msg) => (
                <ChatBubble
                    key={msg.id}
                    message={msg.content}
                    fromSender={msg.fromSender}
                    timestamp={msg.timestamp}
                />
            ))}

            <div ref={bottomRef} />
        </div>
    );
}

export default ChatView;