import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as wsTypes from '../types/websocketTypes.ts'

let stompClient: Client | null = null;
const socket_url = "http://localhost:8085/ws-chat";


class WebSocketService {
    private client: Client | null = null;
    private isConnected: boolean = false;
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

    connect (
        jwtToken:string,
        onConnect: () => void = () => {},
        onDisconnect: () => void = () => {},
        onError: (error:any) => void = () => {}
        ): void {
        if (this.client && this.client.connected) {
            console.log("Already connected to STOMP client.");
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(socket_url),
            reconnectDelay: 5000,
            connectHeaders: { Authorization: `Bearer ${jwtToken}` },
            onConnect: () => {
                this.isConnected = true;
                console.log("WebSocket connected");
                onConnect();
                this.resubscribe();
            },
            onDisconnect: () => {
                this.isConnected = false;
                console.log("WebSocket disconnected");
                onDisconnect();
            },
            onStompError: (error) => {
                console.error(`WebSocket error: `, error);
                onError(error)
            }
        });
        this.client.activate();
    }

    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
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
                if (this.client && this.client.connected) {
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
                destination: `/app${destination}`,
                body: JSON.stringify(body)
            });
        }
        else {
            console.log('WebSocket is not connected')
        }
    }

    subscribeToPresence(
        userId: number,
        callback: PresenceCallback
    ): void {
        this.subscribe(`/topic/presence/${userId}`, (message) => {
            const presenceUpdate = JSON.parse(message.body) as {
                userId: number;
                isOnline: boolean;
            };
            callback(presenceUpdate.userId, presenceUpdate.isOnline);
        });
    }

    subscribeToChat(chatId: number, callback: ChatMessageCallback): void {
        this.subscribe(`/topic/chat/${chatId}`, (message) => {
            const chatMessage = JSON.parse(message.body);
            callback(chatId, chatMessage);
        });
    }

    subscribeToPrivateChats(callback: ChatMessageCallback): void {
        this.subscribe('/user/queue/chats', (message) => {
            const chatUpdate = JSON.parse(message.body);
            callback(chatUpdate.chatId, chatUpdate);
        });
    }

    subscribeToTyping(callback: TypingCallback): void {
        this.subscribe('/user/queue/typing', (message) => {
            const typingEvent = JSON.parse(message.body) as {
                userId: number;
                isTyping: boolean;
            };
            callback(typingEvent.userId, typingEvent.isTyping);
        });
    }

    isConnectedToSocket(): boolean {
        return this.isConnected;
    }
}

export const websocketService = new WebSocketService();