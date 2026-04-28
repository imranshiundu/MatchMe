import {useState, useEffect, useRef} from 'react';
import ConnectionCard from '../components/chat/ConnectionCard.tsx'
import ChatView from '../components/chat/ChatView.tsx'
import {useAuth} from "../hooks/useAuth";
import {websocketService} from '../services/websocketService.ts'

interface Connection {
    id: number,
    isOnline?: boolean
}

function Connections() {
    const [openChat, setOpenChat] = useState(null);
    const [connections, setConnections] = useState<Connection[]>([])
    const connectionRef = useRef<Set<string>>(new Set());
    const {token} = useAuth();

    useEffect(() => {
        // Clean up previous subscriptions
        connectionRef.current.forEach(destination => {
            websocketService.unsubscribe(destination);
        });
        connectionRef.current.clear();

        async function fetchAndSubscribe() {
            // Fetch connections
            const connectionsHttpRequest = await fetch('http://localhost:8085/connections', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const connectionsHttpResponse = await connectionsHttpRequest.json();
            // Initialize isOnline as false for all connections
            const connectionsWithStatus = connectionsHttpResponse.map((conn: Connection) => ({
                ...conn,
                isOnline: false
            }));
            console.log("Fetched connections:", connectionsWithStatus);
            setConnections(connectionsWithStatus);

            // Subscribe to presence for each connection
            connectionsWithStatus.forEach((connection) => {
                const destination = `/topic/presence/${connection.id}`;
                websocketService.subscribeToPresence(
                    connection.id,
                    (userId, isOnline) => {
                        setConnections(prevState => prevState.map(
                            conn => conn.id === userId ? {...conn, isOnline} : conn
                        ));
                        console.log(`User ${userId} is ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
                    }
                );
                connectionRef.current.add(destination);
            });
        }

        fetchAndSubscribe();

        return () => {
            // Clean up subscriptions on unmount
            connectionRef.current.forEach(destination => {
                websocketService.unsubscribe(destination);
            });
            connectionRef.current.clear();
        };
    }, [token]);

    return (
        <div className={'flex h-full justify-center'}>
            <section
                className={'w-185 mx-3 my-3 bg-[#1C1B1B] px-5 py-3 rounded-xl flex flex-col items-center border-2 border-[#313030]'}>
                <p className={'text-[#C0FF00] text-2xl'}>connections</p>
                <div>
                    {connections?.map((connection) => (
                        <ConnectionCard
                            key={connection.id}
                            userId={connection.id}
                            isOnline={connection.isOnline}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Connections;

/*
            <section className={'flex-grow my-3 mx-3'}>
                <ChatView connectionName={connection.name} isOnline={connection.online}/>
            </section>
 */