import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton.tsx'

function Header () {
    return (
        <header className='flex h-10 justify-evenly items-center bg-[#313030] text-[#adaaaa] rounded-b-xl text-xl'>
            <NavLink to="/connections" className={({isActive})=> isActive ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}>connections</NavLink>
            <NavLink to="/match" className={({isActive})=> isActive ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}>match</NavLink>
            <NavLink to="/me" className={({isActive})=> isActive ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}>me</NavLink>
            <LogoutButton/>
        </header>
    )
}

export default Header;