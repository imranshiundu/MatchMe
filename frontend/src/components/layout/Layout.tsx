import Header from "./Header.tsx";
import { Outlet } from 'react-router-dom'

function Layout () {
    return (
        <div className={'flex flex-col h-screen'}>
            <Header/>
            <main className={'flex-1 overflow-auto'}>
                <Outlet/>
            </main>
        </div>
    )
}

export default Layout;