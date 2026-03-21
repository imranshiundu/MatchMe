import { Link } from 'react-router-dom'

function Header () {
    return (
        <footer className='flex h-10 justify-evenly items-center bg-[#252422] text-[#FFFCF2] font-bold'>
            <Link to="/messages" className='hover:underline decoration-2 decoration-[#EB5E28]'>messages</Link>
            <Link to="/dashboard" className='hover:underline decoration-2 decoration-[#EB5E28]'>matches</Link>
            <Link to="/profile" className='hover:underline decoration-2 decoration-[#EB5E28]'>me</Link>
        </footer>
    )
}

export default Header;