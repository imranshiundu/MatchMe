import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import Icon from '../Icon.tsx';

function Layout() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        const fetchNotifications = async () => {
            try {
                const res = await fetch('http://localhost:8085/connection-requests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    
                    const enriched = await Promise.all(
                        data.map(async (req: any) => {
                            const userRes = await fetch(`http://localhost:8085/profile/${req.userA}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const userDetails = userRes.ok ? await userRes.json() : null;
                            return {
                                id: req.id,
                                type: 'follow',
                                user: userDetails ? userDetails.nickname : 'Someone',
                                imageUrl: userDetails ? userDetails.imageUrl : '',
                                time: 'New',
                                text: 'sent you a connection request'
                            };
                        })
                    );
                    setNotifications(enriched);
                }
            } catch (error) {
                console.error("Failed to load notifications", error);
            }
        };
        fetchNotifications();
        
        // Polling for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#C0FF00] selection:text-[#121212]">
            <Header />
            
            <div className="flex pt-16 h-screen overflow-hidden">
                {/* Left Sidebar */}
                <Sidebar />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#121212] relative no-scrollbar">
                    <div className="max-w-5xl mx-auto w-full min-h-full px-4 md:px-10 py-8">
                        <Outlet />
                    </div>
                </main>
                
                {/* Right Sidebar - Redesigned as Notifications */}
                <aside className="hidden xl:flex flex-col w-[380px] p-8 bg-[#121212] border-l border-[#313030]/20">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#5a6a6a]">Notifications</h3>
                        <div className="w-2 h-2 bg-[#C0FF00] rounded-full shadow-[0_0_8px_#C0FF00]"></div>
                    </div>
                    
                    <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar flex-1">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id}
                                    className="py-6 border-b border-[#313030]/20 group last:border-none"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1C1B1B] border border-[#313030]/30 flex items-center justify-center flex-shrink-0 text-[#C0FF00] overflow-hidden group-hover:border-[#C0FF00]/50 transition-all">
                                            {notif.imageUrl ? (
                                                <img src={notif.imageUrl} alt={notif.user} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src="/favicon.svg" alt="Avatar" className="w-6 h-6 object-contain opacity-80" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm leading-relaxed">
                                                <span className="font-bold text-white group-hover:text-[#C0FF00] transition-colors">{notif.user}</span>
                                                <span className="text-[#adaaaa] font-medium"> {notif.text}</span>
                                            </p>
                                            <p className="text-[10px] font-bold text-[#5a6a6a] uppercase tracking-widest mt-2">{notif.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-xs text-[#5a6a6a] font-medium italic">Your activity log is clear.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#313030]/30">
                        <button className="w-full py-2 text-[#5a6a6a] text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#C0FF00] transition-all">
                            // Clear All Activity
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Layout;
