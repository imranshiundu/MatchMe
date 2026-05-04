import { type SubmitEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { registrationData, serverAuthResponse } from "../../types/loginFormData.ts";
import { websocketService } from '../../services/websocketService.ts';
import { useAuth } from '../../hooks/useAuth.tsx';

function RegistrationForm({ switchAuth }: { switchAuth: () => void }) {
    const [registrationDetails, setRegistrationDetails] = useState<registrationData>({
        email: '',
        password: '',
        repeatPassword: ''
    });
    
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
    
    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegistrationDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const { setAuthToken } = useAuth();
    
    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8085/register', {
                method: 'POST',
                body: JSON.stringify(registrationDetails),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                const error = await response.json() as { message: string };
                throw new Error(error.message || 'Auth failed');
            }
            const data = await response.json() as serverAuthResponse;
            setAuthToken(data.token);
            websocketService.connect(
                data.token,
                () => console.log('WebSocket connected'),
                () => console.log('WebSocket disconnected'),
                (error) => console.error('WebSocket error:', error)
            );
            navigate('/match');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5 font-mono">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#8a9a9a]">Email address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="imranshiundu@gmail.com"
                    value={registrationDetails.email}
                    onChange={handleChange}
                    className="w-full bg-[#f0f4ff] border-none text-[#1a2318] placeholder-gray-400 px-4 py-3 rounded-lg outline-none font-sans"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#8a9a9a]">Create password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••••••"
                        value={registrationDetails.password}
                        onChange={handleChange}
                        className="w-full bg-[#f0f4ff] border-none text-[#1a2318] placeholder-gray-400 px-4 py-3 rounded-lg outline-none font-sans pr-12"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#8a9a9a]">Confirm password</label>
                <div className="relative">
                    <input
                        type={showRepeatPassword ? "text" : "password"}
                        name="repeatPassword"
                        placeholder="••••••••••••"
                        value={registrationDetails.repeatPassword}
                        onChange={handleChange}
                        className="w-full bg-[#f0f4ff] border-none text-[#1a2318] placeholder-gray-400 px-4 py-3 rounded-lg outline-none font-sans pr-12"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                        aria-label={showRepeatPassword ? "Hide password" : "Show password"}
                    >
                        {showRepeatPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-[#C0FF00] text-[#121212] font-bold text-lg py-3 rounded-lg hover:bg-[#a5db00] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(192,255,0,0.3)] hover:shadow-[0_0_25px_rgba(192,255,0,0.5)] mt-4 cursor-pointer"
            >
                Create account
            </button>

            <div className="text-center mt-2">
                <button 
                    type="button"
                    onClick={switchAuth} 
                    className="text-[#adaaaa] hover:text-[#C0FF00] text-sm transition-colors cursor-pointer"
                >
                    Already have an account? Login
                </button>
            </div>

            {error && (
                <div className="bg-[#1C1B1B] text-[#ff7351] border border-[#313030] p-3 rounded-lg text-sm mt-2">
                    {error}
                </div>
            )}
        </form>
    );
}

export default RegistrationForm;
