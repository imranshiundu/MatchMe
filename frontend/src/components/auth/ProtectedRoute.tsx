import {Navigate, Outlet} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function ProtectedRoute() {
    const token = localStorage.getItem('token');

    if (!token || jwtDecode(token).exp < (Date.now()/1000)) {
        return <Navigate to={"/login"} replace/>;
    }
    return <Outlet/>
}

export default ProtectedRoute;