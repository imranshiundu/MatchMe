import { type SubmitEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { registrationData, serverAuthResponse } from "../../types/loginFormData.ts";
import { websocketService } from '../../services/websocketService.ts';
import { useAuth } from '../../hooks/useAuth.tsx';
import Icon from "../Icon.tsx";

function RegistrationForm({ switchAuth }: { switchAuth: () => void }) {
    const [registrationDetails, setRegistrationDetails] = useState<registrationData>({
        email: '',
        password: '',
        repeatPassword: ''
    });
    
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const { setAuthToken } = useAuth();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegistrationDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError('');
        
        if (registrationDetails.password !== registrationDetails.repeatPassword) {
            setError("Entropy Mismatch: Passwords do not align.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8085/register', {
                method: 'POST',
                body: JSON.stringify(registrationDetails),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                const errorData = await response.json() as { message: string };
                throw new Error(errorData.message || 'System error during registration');
            }
            const data = await response.json() as serverAuthResponse;
            setAuthToken(data.token);
            websocketService.connect(data.token);
            navigate('/match');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'System Failure.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#5a6a6a] uppercase tracking-[0.3em] ml-2">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="imran.shiundu@gmail.com"
                    value={registrationDetails.email}
                    onChange={handleChange}
                    className="w-full bg-[#1C1B1B] border border-[#313030] text-white placeholder-[#313030] px-4 py-3.5 rounded-[5px] outline-none focus:border-[#C0FF00] transition-all text-sm font-medium"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#5a6a6a] uppercase tracking-[0.3em] ml-2">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••••••"
                        value={registrationDetails.password}
                        onChange={handleChange}
                        className="w-full bg-[#1C1B1B] border border-[#313030] text-white placeholder-[#313030] px-4 py-3.5 rounded-[5px] outline-none focus:border-[#C0FF00] transition-all text-sm font-medium pr-14"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a6a6a] hover:text-[#C0FF00] transition-colors p-1"
                    >
                        <Icon name={showPassword ? "ignore-icon" : "view-profile-icon"} size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#5a6a6a] uppercase tracking-[0.3em] ml-2">Repeat Password</label>
                <div className="relative">
                    <input
                        type={showRepeatPassword ? "text" : "password"}
                        name="repeatPassword"
                        placeholder="••••••••••••"
                        value={registrationDetails.repeatPassword}
                        onChange={handleChange}
                        className="w-full bg-[#1C1B1B] border border-[#313030] text-white placeholder-[#313030] px-4 py-3.5 rounded-[5px] outline-none focus:border-[#C0FF00] transition-all text-sm font-medium pr-14"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a6a6a] hover:text-[#C0FF00] transition-colors p-1"
                    >
                        <Icon name={showRepeatPassword ? "ignore-icon" : "view-profile-icon"} size={20} />
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#C0FF00] text-[#121212] font-black text-xs uppercase tracking-[0.4em] py-4.5 rounded-[5px] hover:bg-[#A5DB00] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(192,255,0,0.2)] mt-4 flex items-center justify-center gap-3"
            >
                {isSubmitting && <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin"></div>}
                Register
            </button>

            <div className="text-center mt-4">
                <button 
                    type="button"
                    onClick={switchAuth} 
                    className="text-[#5a6a6a] hover:text-[#C0FF00] text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                    Already have an account? <span className="text-[#C0FF00] underline">Login</span>
                </button>
            </div>

            {error && (
                <div className="bg-[#121212] text-[#ff7351] border border-[#ff7351]/20 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 animate-fade-in flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ff7351] animate-pulse"></div>
                    {error}
                </div>
            )}
        </form>
    );
}

export default RegistrationForm;
