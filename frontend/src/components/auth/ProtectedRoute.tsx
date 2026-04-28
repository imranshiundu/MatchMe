import {Navigate, Outlet} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useAuth } from '../../hooks/useAuth.tsx';

function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return <Outlet/>
    }
    return <Navigate to={"/login"} replace/>;
}

export default ProtectedRoute;