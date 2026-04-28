import { useState, useEffect } from 'react';
import { useAuth } from './useAuth'; // Assuming you have this hook for the token

// Define the ChatMsgDTO interface to match your backend DTO
export interface ChatMsgDTO {
    id: number;
    chatId: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export const useFetchChatHistory = (
    chatId: number | null,
    page: number = 0,
    size: number = 20
) => {
    const [messages, setMessages] = useState<ChatMsgDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAuth(); // Get the auth token

    useEffect(() => {
        if (!chatId || !token) {
            return;
        };

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:8085/chats/${chatId}/messages?page=${page}&size=${size}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }

                const data: ChatMsgDTO[] = await response.json();
                setMessages(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch messages');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [chatId, page, size, token]);

    return { messages, loading, error };
};