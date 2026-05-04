import Icon from '../Icon.tsx'
import { NavLink, Link } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton.tsx'

function Header () {
    const navLinkClass = ({isActive}: {isActive: boolean}) => 
        isActive 
            ? 'flex items-center gap-2 border-b-2 border-[#C0FF00] text-[#C0FF00] fill-[#C0FF00] px-4 h-full transition-all duration-150 whitespace-nowrap'
            : 'flex items-center gap-2 text-[#adaaaa] fill-[#adaaaa] hover:text-[#C0FF00] hover:fill-[#C0FF00] border-b-2 border-transparent hover:border-[#C0FF00]/50 px-4 h-full transition-all duration-150 whitespace-nowrap';

    return (
        <header className='sticky top-0 z-50 grid grid-cols-3 h-16 items-center bg-[#1c1b1b] border-b border-[#313030] px-4 md:px-8 shadow-sm'>
            {/* Column 1: Logo */}
            <div className="flex justify-start">
                <Link to="/match" className="flex items-center gap-2 text-xl font-bold text-[#C0FF00] tracking-tight hover:opacity-80 transition-opacity">
                    <span className="bg-[#C0FF00] text-[#121212] px-2 py-0.5 rounded-md text-xl font-black">M</span>
                    <span className="hidden lg:block font-mono">match_me</span>
                </Link>
            </div>

            {/* Column 2: Navigation Links (Isolated Center) */}
            <nav className="flex justify-center items-center h-full gap-2 md:gap-4 overflow-x-auto no-scrollbar">
                <NavLink to="/connections" className={navLinkClass}>
                    <Icon name={'connections-icon'} size={18}/>
                    <span className="hidden md:block text-sm font-semibold tracking-wide">Connections</span>
                </NavLink>
                <NavLink to="/messages" className={navLinkClass}>
                    <Icon name={'message-icon'} size={18}/>
                    <span className="hidden md:block text-sm font-semibold tracking-wide">Messages</span>
                </NavLink>
                <NavLink to="/match" className={navLinkClass}>
                    <Icon name={'network-icon'} size={18}/>
                    <span className="hidden md:block text-sm font-semibold tracking-wide">Discover</span>
                </NavLink>
                <NavLink to="/me" className={navLinkClass}>
                    <Icon name={'profile-icon'} size={18}/>
                    <span className="hidden md:block text-sm font-semibold tracking-wide">Profile</span>
                </NavLink>
            </nav>

            {/* Column 3: Actions (Isolated Right) */}
            <div className="flex justify-end">
                <LogoutButton/>
            </div>
        </header>
    )
}

export default Header;