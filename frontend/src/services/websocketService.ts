import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as wsTypes from '../types/websocketTypes.ts'

const socket_url = "http://localhost:8085/ws-chat";


class WebSocketService {
    private client: Client | null = null;
    private isConnected: boolean = false;
    private isConnecting: boolean = false;
    private subscriptions: wsTypes.Subscription[] = [];

    private resubscribe(): void {
        this.subscriptions.forEach((sub)=> {
            if (this.client && this.client.connected) {
                const subscription = this.client.subscribe(
                    sub.destination,
                    sub.callback
                );
                sub.subscriptionId = subscription.id;
            }
        });
    }

    async connect (
        jwtToken:string,
        onConnect: () => void = () => {},
        onDisconnect: () => void = () => {},
        onError: (error:any) => void = () => {}
        ): Promise<void> {
        if (this.isConnected || this.isConnecting) return;
        this.isConnecting = true;

        if (this.client) {
            await this.disconnect();
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(socket_url),
            reconnectDelay: 5000,
            connectHeaders: { Authorization: `Bearer ${jwtToken}` },
            onConnect: () => {
                this.isConnected = true;
                this.isConnecting = false;
                console.log("WebSocket connected");
                onConnect();
                this.resubscribe();
            },
            onDisconnect: () => {
                this.isConnected = false;
                this.isConnecting = false;
                console.log("WebSocket disconnected");
                onDisconnect();
            },
            onStompError: (error) => {
                this.isConnecting = false;
                console.error(`WebSocket error: `, error);
                onError(error)
            }
        });
        this.client.activate();
    }

    async disconnect(): Promise<void> {
        if (!this.client) return;
        try {
            this.client.reconnectDelay = 0;
            await this.client.deactivate();
        }
        finally {
            this.client = null;
            this.isConnected = false;
            this.subscriptions = [];
        }
    }

    subscribe(
        destination: string,
        callback: wsTypes.MessageCallback
    ) : void {
        const existingSub = this.subscriptions.find(
            (sub) => sub.destination === destination
        );

        if (existingSub) {
            return;
        }
        this.subscriptions.push({ destination, callback });
        if (this.client && this.client.connected) {
            const subscription = this.client.subscribe(destination, callback);
            const newSub = this.subscriptions.find(
                (sub) => sub.destination === destination
            );
            if (newSub) {
                newSub.subscriptionId = subscription.id;
            }
        }
    }

    unsubscribe(destination: string): void {
        this.subscriptions = this.subscriptions.filter((sub) => {
            if (sub.destination === destination) {
                if (this.client && this.client.connected && sub.subscriptionId) {
                    this.client.unsubscribe(sub.subscriptionId);
                }
                return false;
            }
            return true;
        });
    }

    send(destination: string, body: object): void {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: `${destination}`,
                body: JSON.stringify(body)
            });
        }
        else {
            console.log('WebSocket is not connected')
        }
    }

    subscribeToPresence(
        userId: number,
        callback: wsTypes.PresenceCallback
    ): void {
        this.subscribe(`/topic/presence/${userId}`, (message) => {
            const presenceUpdate = JSON.parse(message.body) as {
                userId: number;
                isOnline: boolean;
            };
            callback(presenceUpdate.userId, presenceUpdate.isOnline);
        });
    }

    subscribeToChat(chatId: number, callback: wsTypes.ChatMessageCallback): void {
        this.subscribe(`/topic/chat/${chatId}`, (message) => {
            const chatMessage = JSON.parse(message.body);
            callback(chatId, chatMessage);
        });
    }

    subscribeToPrivateChats(callback: wsTypes.ChatMessageCallback): void {
        this.subscribe('/user/queue/chats', (message) => {
            const chatUpdate = JSON.parse(message.body);
            callback(chatUpdate.chatId, chatUpdate);
        });
    }

    subscribeToMessages(chatId: number, callback: (msg: any) => void): () => void {
        const destination = `/topic/chat/${chatId}`;
        this.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });
        return () => this.unsubscribe(destination);
    }

    subscribeToTyping(callback: (data: { chatId: number; userId: number; isTyping: boolean }) => void): () => void {
        const destination = '/user/queue/typing';
        this.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });
        return () => this.unsubscribe(destination);
    }

    sendTyping(chatId: number, isTyping: boolean): void {
        this.send('/app/chat.typing', { chatId, isTyping });
    }

    sendMessage(chatId: number, content: string): void {
        this.send('/app/chat.send', { chatId, content });
    }

    isConnectedToSocket(): boolean {
        return this.isConnected;
    }
}

export const websocketService = new WebSocketService();
