import {useState, useEffect} from 'react';
import ConnectionCard from '../components/chat/ConnectionCard.tsx'
import ChatView from '../components/chat/ChatView.tsx'

function Connections() {
    const [openChat, setOpenChat] = useState(null);
    const [connections, setConnections] = useState([])
    
    useEffect(() => {
        async function fetchConnections() {
            const connectionsHttpRequest = await fetch('http://localhost:8085/connections', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const connectionsHttpResponse = await connectionsHttpRequest.json();
            setConnections(connectionsHttpResponse);
        }
        fetchConnections();
    }, []);

    return (
        <div className={'flex h-full justify-center'}>
            <section className={'w-185 mx-3 my-3 bg-[#1C1B1B] px-5 py-3 rounded-xl flex flex-col items-center border-2 border-[#313030]'}>
                <p className={'text-[#C0FF00] text-2xl'}>connections</p>
                <div>
                    {connections?.map((connection) => (
                        <ConnectionCard
                            key={connection.id}
                            userId={connection.id}/>
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