import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon';

const menuItems = [
    { name: 'Feed', path: '/match', icon: 'profile-icon' },
    { name: 'Connections', path: '/connections', icon: 'connect-icon' },
    { name: 'Messages', path: '/messages', icon: 'message-icon' },
    { name: 'Your Profile', path: '/me', icon: 'view-profile-icon' },
];

function Sidebar() {
    const location = useLocation();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-[#121212] border-r border-[#313030]/20 p-6 z-40">
                <div className="flex flex-col gap-2 mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5a6a6a] mb-6 ml-4 opacity-50">Navigation</p>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-5 px-6 py-4 transition-all duration-300 group relative ${
                                    isActive
                                        ? 'text-[#C0FF00]'
                                        : 'text-[#adaaaa] hover:text-white'
                                }`}
                            >
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C0FF00] rounded-r-full shadow-[0_0_10px_#C0FF00]"></div>}
                                <Icon 
                                    name={item.icon} 
                                    size={22} 
                                    className={isActive ? 'text-[#C0FF00]' : 'text-[#adaaaa] group-hover:text-white transition-colors'} 
                                />
                                <span className="text-sm font-bold tracking-tight">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pt-8 border-t border-[#313030]/30 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5a6a6a] mb-6 ml-4 opacity-50">Account</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[#ff7351] hover:bg-[#3a1f1f]/50 group"
                    >
                        <Icon name="connect-icon" size={20} className="transition-colors transform rotate-90" />
                        <span className="text-sm font-bold tracking-tight">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-2xl border-t border-[#313030]/50 h-20 px-6 flex items-center justify-around z-50">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1.5 transition-all ${
                                isActive ? 'text-[#C0FF00] scale-110' : 'text-[#adaaaa]'
                            }`}
                        >
                            <Icon name={item.icon} size={22} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{item.name.split(' ')[0]}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

export default Sidebar;