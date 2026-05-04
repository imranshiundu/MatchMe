import Header from "./Header.tsx";
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { websocketService } from '../../services/websocketService.ts';

function Layout () {
    const { token } = useAuth();

    useEffect(() => {
        if (!token || websocketService.isConnectedToSocket()) {
            return;
        }

        websocketService.connect(token);

        return () => {
            websocketService.disconnect();
        };
    }, [token]);

    return (
        <div className={'flex flex-col h-screen'}>
            <Header/>
            <main className={'flex-1 overflow-auto'}>
                <Outlet/>
            </main>
        </div>
    )
}

export default Layout;
