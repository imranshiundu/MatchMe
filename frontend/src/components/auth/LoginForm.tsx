import {type SubmitEvent, useState} from "react";
import type {loginFormData, serverAuthResponse} from "../../types/loginFormData.ts";

function LoginForm() {
    const [loginDetails, setLoginDetails] =
        useState<loginFormData>({
            email: '',
            password: ''
        });

    const [error, setError] = useState<string>('');

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.target;
        setLoginDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:5432/matchme/login',
                {
                    method: 'POST',
                    body: JSON.stringify(loginDetails)
                })
            if (!response.ok) {
                const error = await response.json() as { message: string };
                throw new Error(error.message || 'Auth failed');
            }
            const data = (await response.json()) as serverAuthResponse;
            console.log('Auth successful: ', data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    }

    return (
        <div className='grid place-items-center'>
            <form
                onSubmit={handleSubmit}
                className='flex flex-col w-75 gap-2'>
                <input
                    type={"text"}
                    placeholder='email'
                    name={'email'}
                    value={loginDetails.email}
                    onChange={handleChange}
                    className='bg-white text-black'/>
                <input
                    type={"password"}
                    placeholder='password'
                    name={'password'}
                    value={loginDetails.password}
                    onChange={handleChange}
                    className='bg-white text-black'/>
                <button type='submit' className='cursor-pointer bg-[#EB5E28]'>Login</button>
                {
                    // TODO style the error message
                }
                {error && <p className={''}>
                    {error}
                </p>}
            </form>
        </div>
    )
}

export default LoginForm;
