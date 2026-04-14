import { NavLink } from 'react-router-dom'

function Header () {
    return (
        <header className='flex h-10 justify-evenly items-center bg-[#313030] text-[#adaaaa] rounded-b-xl text-xl'>
            <NavLink to="/messages" className={({isActive})=> isActive ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}>message</NavLink>
            <NavLink to="/dashboard" className={({isActive})=> isActive ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}>connect</NavLink>
            <NavLink to="/profile" className={({isActive})=> isActive ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs':'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}>profile</NavLink>
        </header>
    )
}

export default Header;