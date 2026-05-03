import {type SubmitEvent, useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import type {loginFormData, serverAuthResponse} from "../../types/loginFormData.ts";
import { websocketService } from '../../services/websocketService.ts';
import { useAuth } from '../../hooks/useAuth.tsx';

function LoginForm() {
    const [loginDetails, setLoginDetails] =
        useState<loginFormData>({
            email: '',
            password: ''
        });

    const [error, setError] = useState<string>('');
    const [isReady, setIsReady] = useState<boolean>(false)
    const navigate = useNavigate();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.target;
        setLoginDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const { setAuthToken, token, logout } = useAuth();
    useEffect(() => {
        const closeSocket = async () => {
            try {
                await websocketService.disconnect();
            }
            finally {
                logout();
                setIsReady(true);
            }
        }
        void closeSocket();
    }, []);

    useEffect(() => {
        if (!isReady || !token) return;
        websocketService.connect(
            token,
            () => console.log('WebSocket connected'),
            () => console.log('WebSocket disconnected'),
            (error) => console.error('WebSocket error:', error)
        );
    }, [isReady, token]);

    useEffect(() => {
        if (!isReady || !token) return;
        navigate('/match');
    }, [isReady, token, navigate]);

    const handleLogin = async (e: SubmitEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:8085/login',
                {
                    method: 'POST',
                    body: JSON.stringify(loginDetails),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            if (!response.ok) {
                const error = await response.json() as { message: string };
                throw new Error(error.message || 'Auth failed');
            }
            const data = await response.json() as serverAuthResponse;
            setAuthToken(data.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    }

    return (
        <div className='grid place-items-center bg-[#1C1B1B] h-fit w-fit px-10 py-5 border-2 border-[#313030] rounded-xl'>
            <h1 className={'text-2xl py-2'}>login</h1>
            <form
                onSubmit={handleLogin}
                className='flex flex-col w-75 gap-2'>
                <p className={'text-[#adaaaa] mt-5'}>//enter <span className={'text-[#D8FF80]'}>email</span></p>
                <input
                    type={"text"}
                    placeholder='e.g. neo@matrix.net'
                    name={'email'}
                    value={loginDetails.email}
                    onChange={handleChange}
                    className='bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 my-3 outline-none'/>
                <p className={'mt-5 text-[#adaaaa]'}>//enter <span className={'text-[#D8FF80]'}>password</span></p>
                <input
                    type={"password"}
                    placeholder='password'
                    name={'password'}
                    value={loginDetails.password}
                    onChange={handleChange}
                    className='bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 my-3 outline-none'/>
                <button type='submit' className='cursor-pointer bg-[#C0FF00] text-[#121212] mt-5 p-2 rounded-md hover:bg-[#D8FF80] hover:text-[#1c1b1b] transition-all delay-100'>login</button>
                {error && <p className={'bg-[#121212] text-[#ff7351] border-1 p-2 rounded-sm mt-5'}>
                    {error}
                </p>}
            </form>
        </div>
    )
}

export default LoginForm;