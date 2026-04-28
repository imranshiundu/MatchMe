import {type SubmitEvent, useState} from "react";
import {useNavigate} from 'react-router-dom';
import type {registrationData, serverAuthResponse} from "../../types/loginFormData.ts";
import { websocketService } from '../../services/websocketService.ts';
import { useAuth } from '../../hooks/useAuth.tsx';

function RegistrationForm() {
    const [registrationDetails, setRegistrationDetails] =
        useState<registrationData>({
            email: '',
            password: '',
            repeatPassword: ''
        });
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.target;
        setRegistrationDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const { setAuthToken, token } = useAuth();
    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:8085/register',
                {
                    method: 'POST',
                    body: JSON.stringify(registrationDetails),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            if (!response.ok) {
                const error = await response.json() as { message: string };
                throw new Error(error.message || 'Auth failed');
            }
            setAuthToken((await response.json() as serverAuthResponse).token);
            websocketService.connect(
                token,
                () => console.log('WebSocket connected'),
                () => console.log('WebSocket disconnected'),
                (error) => console.error('WebSocket error:', error)
            );
            navigate('/match');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    }

    return (
        <div className='grid place-items-center bg-[#1C1B1B] h-fit w-fit px-10 py-5 rounded-xl'>
            <h1 className={'text-2xl py-2'}>create_account</h1>
            <form
                onSubmit={handleSubmit}
                className='flex flex-col w-75 gap-2'>
                <p className={'text-[#adaaaa] mt-5'}>//enter <span className={'text-[#D8FF80]'}>email</span></p>
                <input
                    type={"text"}
                    placeholder='e.g. neo@matrix.net'
                    name={'email'}
                    value={registrationDetails.email}
                    onChange={handleChange}
                    className='bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 my-3 outline-none'/>
                <p className={'mt-5 text-[#adaaaa]'}>//create <span className={'text-[#D8FF80]'}>password</span></p>
                <input
                    type={"password"}
                    placeholder='password'
                    name={'password'}
                    value={registrationDetails.password}
                    onChange={handleChange}
                    className='bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 my-3 outline-none'/>
                <input
                    type={"password"}
                    placeholder='repeat password'
                    name={'repeatPassword'}
                    value={registrationDetails.repeatPassword}
                    onChange={handleChange}
                    className='bg-[#121212] placeholder-[#adaaaa] text-[#C0FF00] p-2 outline-none'/>
                <button type='submit' className='cursor-pointer bg-[#C0FF00] text-[#121212] mt-5 p-2 rounded-md hover:bg-[#D8FF80] hover:text-[#1c1b1b] transition-all delay-100'>register</button>
                {error && <p className={'bg-[#121212] text-[#ff7351] border-1 p-2 rounded-sm mt-5'}>
                    {error}
                </p>}
            </form>
        </div>
    )
}

export default RegistrationForm;
