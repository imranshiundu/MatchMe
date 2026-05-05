import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.tsx'
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


export const useFetchChatDetails = () => {
    const [chats, setChats] = useState<ChatItemDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;

        const fetchChats = async () => {
            try {
                setLoading(true);

                const response = await fetch('http://localhost:8085/chats', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch chats');
                }

                const data: ChatItemDTO[] = await response.json();
                setChats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch chats');
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [token]);

    return { chats, loading, error };
};