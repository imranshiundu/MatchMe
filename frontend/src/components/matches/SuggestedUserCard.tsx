import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import Icon from '../Icon.tsx'

interface UserDetails {
    nickname: string;
    interest: string[];
    imageUrl: string;
    bio: string;
    location?: string;
}

function SuggestedUserCard({ userID, refresh }: { userID: number, refresh: (val: boolean) => void }) {
    const { token } = useAuth();
    const [userDetails, setUserDetails] = useState<UserDetails>({
        nickname: '',
        interest: [],
        imageUrl: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUserDetails() {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8085/users/${userID}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const profile = await response.json();
                    setUserDetails({
                        nickname: profile.nickname,
                        imageUrl: profile.imageUrl,
                        interest: profile.interest || [],
                        bio: profile.bio,
                        location: profile.location
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        }
        getUserDetails();
    }, [userID, token]);

    const handleAction = async (endpoint: string) => {
        try {
            const response = await fetch(`http://localhost:8085${endpoint}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) refresh(true);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#1C1B1B] border border-[#313030] rounded-3xl p-8 w-full animate-pulse">
                <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-[#121212] rounded-full mb-6"></div>
                    <div className="h-4 w-32 bg-[#121212] rounded mb-3"></div>
                    <div className="h-3 w-48 bg-[#121212] rounded mb-8"></div>
                </div>
            </div>
        );
    }

    const avatarUrl = userDetails.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userDetails.nickname || userID}&backgroundColor=121212`;
    const fullName = userDetails.nickname || `User ${userID}`;

    return (
        <div className="bg-[#1C1B1B] border border-[#313030] rounded-3xl overflow-hidden shadow-2xl hover:border-[#C0FF00]/40 transition-all duration-500 group flex flex-col h-full relative">
            {/* Soft Header */}
            <div className="h-24 bg-[#121212] relative">
                <div className="absolute inset-0 opacity-5" style={{ 
                    backgroundImage: 'radial-gradient(#C0FF00 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                }}></div>
            </div>
            
            <div className="px-6 pb-8 flex flex-col flex-1 items-center -mt-12 relative z-10">
                {/* Avatar */}
                <Link to={`/match/${userID}`} className="relative mb-5 group/avatar">
                    <img
                        className="h-24 w-24 rounded-full object-cover border-4 border-[#1C1B1B] shadow-2xl group-hover/avatar:border-[#C0FF00] transition-all duration-500 bg-[#121212]"
                        src={avatarUrl}
                        alt={fullName}
                    />
                </Link>

                {/* Info */}
                <div className="text-center mb-6 flex-1 w-full">
                    <Link to={`/match/${userID}`} className="text-xl font-bold text-white hover:text-[#C0FF00] transition-colors">
                        {fullName}
                    </Link>
                    <p className="text-[10px] font-black text-[#5a6a6a] mb-4 flex items-center justify-center gap-2 uppercase tracking-widest mt-1.5">
                        <Icon name="location-icon" size={12} />
                        {userDetails.location || 'Professional'}
                    </p>
                    <p className="text-sm text-[#adaaaa] line-clamp-3 px-2 font-medium leading-relaxed opacity-80">
                        {userDetails.bio || "Building the next generation of web experiences and collaborative systems."}
                    </p>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {userDetails.interest?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-[#121212] text-[#C0FF00] rounded-full text-[9px] font-bold uppercase tracking-widest border border-[#313030]">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full mt-auto">
                    <button
                        onClick={() => handleAction(`/${userID}/request`)}
                        className="flex-1 bg-[#C0FF00] text-[#121212] font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-[#A5DB00] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Icon name="connect-icon" size={14} />
                        Follow
                    </button>
                    <Link
                        to={`/match/${userID}`}
                        className="flex-1 bg-[#121212] text-white border border-[#313030] font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-widest hover:border-[#C0FF00] transition-all flex items-center justify-center gap-2"
                    >
                        <Icon name="view-profile-icon" size={14} />
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SuggestedUserCard;