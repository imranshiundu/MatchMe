import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import Icon from "../Icon";
import { websocketService } from '../../services/websocketService.ts'

function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await websocketService.disconnect();
        } catch (err) {
            console.error('WebSocket disconnect failed:', err);
        }
        finally {
            logout();
            navigate('/');
        }
    }

    return (
        <Link
            to={'/'}
            onClick={handleLogout}
            className={'px-4 py-2 rounded-xs fill-[#adaaaa] hover:fill-[#ff7351] border-b-3 border-transparent hover:bg-[#474646] hover:border-[#ff7351] transition-all duration-150'}>
            <Icon name={'logout-icon'}/>
        </Link>
    )
}

export default LogoutButton;