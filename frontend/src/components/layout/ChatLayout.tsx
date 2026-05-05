import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { websocketService } from '../../services/websocketService.ts';
import Header from './Header.tsx';

function ChatLayout() {
    const { token } = useAuth();

    useEffect(() => {
        if (token && !websocketService.isConnectedToSocket()) {
            websocketService.connect(token);
        }
    }, [token]);

    return (
        <div className="h-screen bg-[#121212] text-white font-sans flex flex-col overflow-hidden">
            <Header />
            {/* Full-height chat area: below fixed header (64px), above mobile nav (64px on mobile) */}
            <div className="flex-1 overflow-hidden pt-16 pb-16 md:pb-0">
                <Outlet />
            </div>
            {/* Mobile bottom nav placeholder so chat doesn't sit behind it */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1C1B1B] border-t border-[#313030] flex items-center justify-around px-4 z-50">
                <a href="/match" className="flex flex-col items-center gap-1 text-[#5a6a6a] hover:text-[#C0FF00] transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[8px] font-black uppercase tracking-widest">Feed</span>
                </a>
                <a href="/connections" className="flex flex-col items-center gap-1 text-[#5a6a6a] hover:text-[#C0FF00] transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    <span className="text-[8px] font-black uppercase tracking-widest">Connect</span>
                </a>
                <a href="/messages" className="flex flex-col items-center gap-1 text-[#C0FF00]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    <span className="text-[8px] font-black uppercase tracking-widest">Messages</span>
                </a>
                <a href="/me" className="flex flex-col items-center gap-1 text-[#5a6a6a] hover:text-[#C0FF00] transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="text-[8px] font-black uppercase tracking-widest">Your</span>
                </a>
            </nav>
        </div>
    );
}

export default ChatLayout;
