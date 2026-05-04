import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import Icon from '../Icon.tsx'

interface UserDetails {
    nickname: string;
    interest: string[];
    imageUrl: string;
    bio: string;
    prompt1?: string;
    answer1?: string;
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
        async function getUserDetails(userID) {
            try {
                setLoading(true);

                const profileRes = await fetch(`http://localhost:8085/users/${userID}/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const profile = await profileRes.json();

                setUserDetails({
                    nickname: profile.nickname,
                    imageUrl: profile.imageUrl,
                    interest: profile.interest,
                    bio: profile.bio,
                    prompt1: profile.prompt1,
                    answer1: profile.answer1
                });

            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        }

        getUserDetails(userID);
    }, [userID, token]);

    const handleRequestConnection = async () => {
        try {
            const response = await fetch(`http://localhost:8085/${userID}/request`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed');

            console.log('Connection sent');
            refresh(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDismissSuggestion = async () => {
        try {
            const response = await fetch(`http://localhost:8085/profile/${userID}/dismiss`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to dismiss');

            console.log('User dismissed');
            refresh(true);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#1c1b1b] border-2 border-[#313030] rounded-2xl p-6 w-full max-w-sm h-[400px] animate-pulse flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 bg-[#313030] rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-32 bg-[#313030] rounded"></div>
                        <div className="h-3 w-20 bg-[#313030] rounded"></div>
                    </div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="h-3 w-full bg-[#313030] rounded"></div>
                    <div className="h-3 w-5/6 bg-[#313030] rounded"></div>
                </div>
                <div className="h-10 w-full bg-[#313030] rounded-lg mt-auto"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#1c1b1b] border-2 border-[#313030] rounded-2xl p-6 w-full max-w-sm flex flex-col min-h-[400px] group hover:border-[#C0FF00]/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <img
                        className="h-16 w-16 rounded-xl object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-colors"
                        src={userDetails.imageUrl}
                        alt="Profile"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-[#C0FF00] transition-colors">
                            {userDetails.nickname}
                        </h2>
                        <p className="text-[#adaaaa] text-xs font-mono uppercase tracking-widest mt-0.5">Developer</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-4">
                {/* Bio Snippet */}
                {userDetails.bio && (
                    <p className="text-sm text-[#adaaaa] line-clamp-3 italic leading-relaxed">
                        "{userDetails.bio}"
                    </p>
                )}

                {/* Prompt Snippet */}
                {userDetails.prompt1 && userDetails.answer1 && (
                    <div className="bg-[#252422] p-3 rounded-xl border border-[#313030]">
                        <p className="text-[10px] font-bold text-[#C0FF00] uppercase tracking-tighter mb-1">{userDetails.prompt1}</p>
                        <p className="text-white text-xs line-clamp-2">{userDetails.answer1}</p>
                    </div>
                )}

                {/* Interests */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                    {userDetails.interest?.slice(0, 4).map((interest) => (
                        <span
                            key={interest}
                            className="px-2 py-0.5 bg-[#313030] rounded-md text-[10px] font-bold text-[#D8FF80] uppercase tracking-wider"
                        >
                            {interest}
                        </span>
                    ))}
                    {userDetails.interest?.length > 4 && (
                        <span className="text-[10px] text-[#5a6a6a] font-bold self-center">+{userDetails.interest.length - 4} more</span>
                    )}
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={handleDismissSuggestion}
                    className="flex-1 flex items-center justify-center p-2 rounded-xl bg-[#313030] fill-[#adaaaa] hover:bg-[#3a1f1f] hover:fill-[#ff7351] transition-all duration-200"
                    title="Dismiss"
                >
                    <Icon name={'ignore-icon'} size={20}/>
                </button>
                <Link
                    to={`./${userID}`}
                    className="flex-1 flex items-center justify-center p-2 rounded-xl bg-[#313030] fill-[#adaaaa] hover:bg-[#252422] hover:fill-[#C0FF00] transition-all duration-200"
                    title="View Profile"
                >
                    <Icon name={'view-profile-icon'} size={20}/>
                </Link>
                <button
                    onClick={handleRequestConnection}
                    className="flex-[2] flex items-center justify-center gap-2 p-2 rounded-xl bg-[#C0FF00] text-[#121212] fill-[#121212] font-bold text-sm hover:bg-[#D8FF80] transition-all duration-200"
                >
                    <Icon name={'connect-icon'} size={18}/>
                    <span>Connect</span>
                </button>
            </div>
        </div>
    );
}

export default SuggestedUserCard;