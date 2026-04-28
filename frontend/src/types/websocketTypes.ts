import { Client, IMessage } from '@stomp/stompjs';

export type MessageCallback = (message: IMessage) => void;
export type PresenceCallback = (userId: number, isOnline: boolean) => void;
export type ChatMessageCallback = (chatId: number, message: any) => void;
export type TypingCallback = (userId: number, isTyping: boolean) => void;
export type Subscription = {
    destination: string;
    callback: MessageCallback;
    subscriptionId?: string;
};