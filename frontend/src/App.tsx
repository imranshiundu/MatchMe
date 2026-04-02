import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

// page imports
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import Layout from "./components/layout/Layout.tsx";
import Connections from "./pages/Connections/Connections.tsx";
import Auth from "./pages/Auth/Auth.tsx";
import Chat from "./pages/Messages/Chat.tsx";

// app
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/messages" element={<Connections/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                    <Route path="/login" element={<Auth/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
