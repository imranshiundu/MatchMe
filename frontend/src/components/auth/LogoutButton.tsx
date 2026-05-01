import {Link} from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import Icon from "../Icon";

function LogoutButton() {
    const { logout } = useAuth();
    return (
        <Link
            to={'/'}
            onClick={logout}
            className={'px-4 py-2 rounded-xs fill-[#adaaaa] hover:fill-[#ff7351] border-b-3 border-transparent hover:bg-[#474646] hover:border-[#ff7351] transition-all duration-150'}>
            <Icon name={'logout-icon'}/>
        </Link>
    )
}

export default LogoutButton;