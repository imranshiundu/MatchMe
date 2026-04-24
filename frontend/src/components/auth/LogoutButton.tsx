import {Link} from 'react-router-dom';

function LogoutButton() {

    const handleLogout = () => {
        localStorage.clear();
    }

    return (
        <Link
            to={'/'}
            onClick={() => handleLogout()}
            className={'hover:bg-[#474646] hover:border-[#ff7351] hover:text-[#ff7351] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}>
            logout
        </Link>
    )
}

export default LogoutButton;