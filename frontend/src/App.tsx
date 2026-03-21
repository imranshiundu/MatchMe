import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

// page imports
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import Layout from "./components/layout/Layout.tsx";
import Messages from "./pages/Messages/Messages.tsx";
import Login from "./pages/Auth/Login.tsx";

// app
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/messages" element={<Messages/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
