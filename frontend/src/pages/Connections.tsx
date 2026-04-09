import {useState} from 'react';
import ConnectionCard from '../components/chat/ConnectionCard.tsx'
import ChatView from '../components/chat/ChatView.tsx'

function Connections() {
    const [openChat, setOpenChat] = useState(null);

    //placeholder data until we have real user connections
    const connection = {
        name: 'Johnny Silverhand',
        recentMessage: "Wake the fuck up samurai, we've got a city to burn",
        online: false
    };

    return (
        <div className={'flex'}>
            <section className={'max-w-80 ml-5 mt-5 bg-[#1C1B1B] px-5 py-3 rounded-xl'}>
                <p className={'ml-3 text-[#C0FF00] text-xl'}>connections</p>
                <div>
                    <ConnectionCard connectionName={connection.name} recentMessage={connection.recentMessage} isOnline={connection.online}/>
                </div>
            </section>
            <section className={'flex flex-col'}>
                <ChatView connectionName={connection.name} isOnline={connection.online}/>
            </section>
        </div>
    )
}

export default Connections;