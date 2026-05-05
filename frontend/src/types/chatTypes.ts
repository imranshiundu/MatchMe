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
