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

    if (loading || chatsLoading) return <div>Loading...</div>;
    if (error || chatsError) return <div>Error: {error || chatsError}</div>;

    return (
        <div className="flex h-full justify-center">
            <section className="w-185 mx-3 my-3 px-5 py-3 rounded-xl flex flex-col items-center">
                <p className="text-[#C0FF00] text-2xl">connections</p>

                <div>
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
            </section>
        </div>
    );
}

export default Connections;