import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {useAuth} from "./useAuth";

export interface ChatItemDTO {
    chatId: number;
    participantId: number;
    participantName: string;
    participantPicture: string;
    participantOnline: boolean;
    lastMessage: string;
    lastActivity: string;
    unreadCount: number;
}

//TODO currently does not access data correctly
export const useFetchChatDetails = (connectionsId: number | null) => {
    const [chat, setChat] = useState<ChatItemDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const { token } = useAuth();
    useEffect(() => {
        if (!token) return;

        try {
            const decoded: JwtPayload = jwtDecode(token);
            setCurrentUserId(decoded.sub); // Extract the user ID from the 'sub' claim
        } catch (err) {
            console.error('Failed to decode token:', err);
            setError('Failed to decode token');
        }
    }, [token]);

    useEffect(() => {
        if (!currentUserId || !connectionsId) return;
        const fetchChats = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8085/chats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch chats');
                }
                const data = await response.json();
                console.log(data);
                const currentChat = data.find((chat) => chat.participantId === connectionsId);
                setChat(currentChat);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [connectionsId]);

    return { chat,loading, error };
};