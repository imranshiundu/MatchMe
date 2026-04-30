import Icon from '../Icon.tsx'
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton.tsx'

function Header () {
    return (
        <header className='flex h-12 justify-evenly items-center bg-[#1c1b1b] text-[#adaaaa] fill-[#adaaaa] rounded-b-xl text-xl'>
            <NavLink to="/connections" className={({isActive})=> isActive ? 'border-b-3 border-[#A2D800] bg-[#C0FF00] fill-[#121212] px-4 py-1 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] hover:fill-[#C0FF00] border-b-3 border-transparent px-4 py-1 transition-all duration-150 rounded-xs'}>
                <Icon name={'connections-icon'} size={25}/>
            </NavLink>
            <NavLink to="/match" className={({isActive})=> isActive ? 'border-b-3 border-[#A2D800] bg-[#C0FF00] fill-[#121212] px-4 py-1 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] hover:fill-[#C0FF00] border-b-3 border-transparent px-4 py-1 transition-all duration-150 rounded-xs'}>
                <Icon name={'network-icon'} size={25}/>
            </NavLink>
            <NavLink to="/me" className={({isActive})=> isActive ? 'border-b-3 border-[#A2D800] bg-[#C0FF00] fill-[#121212] px-4 py-1 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] hover:fill-[#C0FF00] border-b-3 border-transparent px-4 py-1 transition-all duration-150 rounded-xs'}>
                <Icon name={'profile-icon'} size={25}/>
            </NavLink>
            <LogoutButton/>
        </header>
    )
}

export default Header;