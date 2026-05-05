import { useState } from "react";
import LoginForm from "../components/auth/LoginForm.tsx";
import RegistrationForm from "../components/auth/RegistrationForm.tsx";
import Icon from "../components/Icon.tsx";

function Auth() {
    const [login, setLogin] = useState<boolean>(true);

    const switchAuth = () => {
        setLogin(!login);
    };

    return (
        <div className="flex min-h-screen w-full bg-[#121212] selection:bg-[#C0FF00] selection:text-[#121212] overflow-hidden relative">
            {/* Professional Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ 
                backgroundImage: 'radial-gradient(#313030 1px, transparent 1px)', 
                backgroundSize: '32px 32px' 
            }}></div>

            {/* Content Container */}
            <div className="relative flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto z-10 px-6 py-12 lg:px-12">
                
                {/* Left Side - Brand & Copy */}
                <div className="flex-1 flex flex-col justify-center lg:pr-16 mb-16 lg:mb-0 animate-fade-in">
                    <div className="mb-12">
                        <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white mb-8">
                            MatchMe<span className="text-[#C0FF00]">.</span>
                        </h1>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-white">
                            Compile your <br />
                            <span className="text-[#C0FF00]">Social Stack.</span>
                        </h2>
                    </div>
                    
                    <div className="max-w-lg">
                        <p className="text-[#adaaaa] text-xl font-medium leading-relaxed mb-12">
                            The definitive professional network engineered for the modern technical community.
                        </p>
                        
                        <div className="flex flex-col gap-10">
                            <div className="flex items-start gap-6 group">
                                <div className="mt-1 text-[#C0FF00]">
                                    <Icon name="search-icon" size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-sm uppercase tracking-widest mb-2">Algorithm Match</h4>
                                    <p className="text-[#5a6a6a] text-sm font-medium leading-relaxed max-w-xs">Engineered discovery based on tech stacks and professional synergy.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group">
                                <div className="mt-1 text-[#C0FF00]">
                                    <Icon name="message-icon" size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-sm uppercase tracking-widest mb-2">Secure Link</h4>
                                    <p className="text-[#5a6a6a] text-sm font-medium leading-relaxed max-w-xs">Real-time encrypted communication for rapid professional scaling.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form Card (De-boxed) */}
                <div className="w-full lg:w-[450px] flex flex-col justify-center items-center lg:items-end">
                    <div className="w-full max-w-md animate-fade-in [animation-delay:0.2s] py-10">
                        <div className="text-center lg:text-left mb-12">
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{login ? 'Login' : 'Register'}</h2>
                            <p className="text-[#5a6a6a] text-xs font-bold uppercase tracking-[0.2em]">{login ? 'Enter your credentials to continue' : 'Join our professional network'}</p>
                        </div>
                        
                        {login ? (
                            <LoginForm switchAuth={switchAuth} />
                        ) : (
                            <RegistrationForm switchAuth={switchAuth} />
                        )}
                    </div>
                    
                    <p className="mt-16 text-center text-[#5a6a6a] text-[10px] font-black uppercase tracking-[0.5em] px-12 lg:text-left lg:px-0 opacity-40 w-full max-w-md">
                        MATCHME SYSTEM // VERSION 2.0.4 // © 2026
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Auth;