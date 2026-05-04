import { useState } from "react";
import LoginForm from "../components/auth/LoginForm.tsx";
import RegistrationForm from "../components/auth/RegistrationForm.tsx";

function Auth() {
    const [login, setLogin] = useState<boolean>(true);

    const switchAuth = () => {
        setLogin(!login);
    };

    return (
        <div 
            className="flex min-h-screen w-full flex-col lg:flex-row text-white font-mono selection:bg-[#C0FF00] selection:text-[#121212]"
            style={{
                backgroundColor: "#121212",
                backgroundImage: "radial-gradient(circle, #313030 1px, transparent 1px)",
                backgroundSize: "32px 32px"
            }}
        >
            {/* Header / Logo */}
            <div className="absolute top-6 left-6 lg:left-12 lg:top-8 flex items-center gap-2 z-50">
                <span className="text-2xl font-bold tracking-tight">
                    <span className="text-[#C0FF00] italic">meet</span>space
                </span>
            </div>

            {/* Content Container */}
            <div className="relative flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto z-10">
                {/* Left Side - Typography & Copy */}
                <div className="flex-1 flex flex-col justify-center px-8 pt-32 pb-16 lg:px-12 lg:py-24">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 tracking-tight">
                            <span className="text-white block">Find your stack.</span>
                            <span className="text-[#C0FF00] block">Find your people.</span>
                        </h1>
                        
                        <div className="space-y-4 text-[#adaaaa] text-lg leading-relaxed max-w-md font-sans">
                            <p>
                                The professional network built exclusively for developers.
                            </p>
                            <ul className="space-y-3 mt-8">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C0FF00]"></div>
                                    <span>Connect based on shared tech stacks</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C0FF00]"></div>
                                    <span>Find collaborators for side projects</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C0FF00]"></div>
                                    <span>Build meaningful professional relationships</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form Area */}
                <div className="w-full lg:w-[450px] flex flex-col justify-center px-8 py-16 lg:px-12">
                    <div className="w-full max-w-sm mx-auto lg:ml-auto">
                        {login ? (
                            <LoginForm switchAuth={switchAuth} />
                        ) : (
                            <RegistrationForm switchAuth={switchAuth} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;