import { useState, useEffect, useMemo } from 'react';
import ConnectionCard from '../components/chat/ConnectionCard.tsx';
import { useAuth } from '../hooks/useAuth';
import { useFetchChatDetails } from '../hooks/useFetchChatDetails.tsx';
import { websocketService } from '../services/websocketService';

type Connection = {
    id: number;
};

type UserDetails = {
    nickname: string;
    imageUrl: string;
};

type ChatMsgDTO = {
    id: number;
    chatId: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    read: boolean;
};

type ConnectionItem = {
    userId: number;
    userDetails: UserDetails;
    chatId: number | null;
    latestMessage: ChatMsgDTO | null;
};

function Connections() {
    const { token } = useAuth();
    const { chats, loading: chatsLoading, error: chatsError } = useFetchChatDetails();

    const chatsByParticipant = useMemo(
        () => Object.fromEntries(chats.map((chat) => [chat.participantId, chat])),
        [chats]
    );

    const [items, setItems] = useState<ConnectionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        if (chatsLoading) return;
        if (chatsError) {
            setError(chatsError);
            return;
        }

        async function loadConnections() {
            try {
                setLoading(true);
                setError(null);

                const connectionsRes = await fetch('http://localhost:8085/connections', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!connectionsRes.ok) {
                    throw new Error('Failed to fetch connections');
                }

                const connections: Connection[] = await connectionsRes.json();

                const enriched = await Promise.all(
                    connections.map(async (connection) => {
                        const userId = connection.id;

                        const userRes = await fetch(`http://localhost:8085/users/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        if (!userRes.ok) {
                            throw new Error(`Failed to fetch user ${userId}`);
                        }

                        const userDetails: UserDetails = await userRes.json();

                        const chat = chatsByParticipant[userId];
                        const chatId = chat?.chatId ?? null;

                        let latestMessage: ChatMsgDTO | null = null;

                        if (chatId) {
                            const msgRes = await fetch(
                                `http://localhost:8085/chats/${chatId}/messages?page=0&size=1&markAsRead=false`,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                }
                            );

                            if (msgRes.ok) {
                                const messages: ChatMsgDTO[] = await msgRes.json();
                                latestMessage = messages[0] ?? null;
                            }
                        }

                        return {
                            userId,
                            userDetails,
                            chatId,
                            latestMessage,
                        };
                    })
                );

                setItems(enriched);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load connections');
            } finally {
                setLoading(false);
            }
        }

        loadConnections();
    }, [token, chatsByParticipant, chatsLoading, chatsError]);

    useEffect(() => {
        items.forEach((item) => {
            if (!item.chatId) return;

            websocketService.subscribeToChat(item.chatId, (_chatId, message) => {
                setItems((prev) =>
                    prev.map((x) =>
                        x.chatId === item.chatId
                            ? { ...x, latestMessage: message }
                            : x
                    )
                );
            });
        });

        return () => {
            items.forEach((item) => {
                if (item.chatId) {
                    websocketService.unsubscribe(`/topic/chat/${item.chatId}`);
                }
            });
        };
    }, [items]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const aTime = a.latestMessage?.timestamp ?? '';
            const bTime = b.latestMessage?.timestamp ?? '';
            return bTime.localeCompare(aTime);
        });
    }, [items]);

    if (loading || chatsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-8 h-8 border-4 border-[#C0FF00] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#adaaaa] animate-pulse">Syncing connections...</p>
            </div>
        );
    }

    if (error || chatsError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <div className="bg-[#3a1f1f] p-4 rounded-full mb-4">
                    <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-[#ff7351] text-xl font-bold mb-2">Sync Error</p>
                <p className="text-[#adaaaa] max-w-md">{error || chatsError}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full py-6 md:py-10">
            <div className="flex flex-col gap-6">
                <div className="flex items-end justify-between px-4 sm:px-0">
                    <div>
                        <h1 className="text-[#C0FF00] text-3xl font-black uppercase tracking-tighter">Connections</h1>
                        <p className="text-[#adaaaa] text-sm mt-1 font-mono">// {items.length} developers in your network</p>
                    </div>
                </div>

                <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl overflow-hidden shadow-2xl">
                    {sortedItems.length > 0 ? (
                        <div className="flex flex-col divide-y divide-[#313030]">
                            {sortedItems.map((item) => (
                                <ConnectionCard
                                    key={item.userId}
                                    userId={item.userId}
                                    nickname={item.userDetails.nickname}
                                    imageUrl={item.userDetails.imageUrl}
                                    latestMessage={item.latestMessage}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                            <div className="bg-[#252422] p-6 rounded-3xl mb-6">
                                <svg className="w-12 h-12 text-[#adaaaa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">No connections yet</h3>
                            <p className="text-[#adaaaa] max-w-xs mb-8 text-sm">Start exploring the discover page to find developers and build your network.</p>
                            <a href="/match" className="px-6 py-3 bg-[#C0FF00] text-[#121212] rounded-xl font-bold hover:bg-[#D8FF80] transition-all active:scale-95">
                                Start Discovering
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Connections;