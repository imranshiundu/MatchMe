import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

// page imports
import Landing from "./pages/Landing.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import Layout from "./components/layout/Layout.tsx";
import Connections from "./pages/Connections.tsx";
import Auth from "./pages/Auth.tsx";
import Chat from "./pages/Chat.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx"

// app
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/login" element={<Auth/>}/>
                <Route element={<ProtectedRoute/>}>
                    <Route element={<Layout/>}>
                        <Route path="/match" element={<Dashboard/>}/>
                        <Route path="/me" element={<Profile/>}/>
                        <Route path="/match/:userId" element={<Profile isConnection={false}/>}/>
                        <Route path="/connections" element={<Connections/>}/>
                        <Route path="/connections/user/:userId" element={<Profile isConnection={true}/>}/>
                        <Route path="/connections/chat/:userId" element={<Chat/>}/>
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to={"/"} replace/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
