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

// app
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route element={<Layout/>}>
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
