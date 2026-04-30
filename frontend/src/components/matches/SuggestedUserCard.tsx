import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";

function SuggestedUserCard({ userID, refresh }) {
    const { token } = useAuth();

    const [userDetails, setUserDetails] = useState<object>({
        nickname: '',
        interest: [],
        imageUrl: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUserDetails(userID) {
            try {
                setLoading(true);

                const userRes = await fetch(`http://localhost:8085/users/${userID}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const user = await userRes.json();

                const profileRes = await fetch(`http://localhost:8085/users/${userID}/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const profile = await profileRes.json();

                setUserDetails({
                    nickname: user.nickname,
                    imageUrl: user.imageUrl,
                    interest: profile.interest
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

    if (loading) {
        return (
            <div className="bg-[#252422] rounded-2xl p-6 w-80 h-80 animate-pulse flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="h-20 w-20 bg-[#3a3a3a] rounded-xl"></div>
                    <div className="h-5 w-32 bg-[#3a3a3a] rounded"></div>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-[#3a3a3a] rounded"></div>
                    <div className="h-4 w-32 bg-[#3a3a3a] rounded"></div>
                </div>

                <div className="h-10 w-full bg-[#3a3a3a] rounded-lg mt-auto"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#1c1b1b] border-2 border-[#313030] rounded-2xl p-6 w-80 flex flex-col min-h-80">

            <div className="flex items-center space-x-4 mb-4">
                <img
                    className="h-20 w-20 rounded-xl object-cover"
                    src={userDetails.imageUrl}
                    alt="Profile"
                />
                <h2 className="text-2xl break-words">
                    {userDetails.nickname}
                </h2>
            </div>
            <div className="flex-1">
                <h3 className="text-[#D8FF80] text-sm mb-2">
                    //common interests
                </h3>

                <div className="flex flex-wrap gap-2">
                    {userDetails.interest?.map((interest) => (
                        <span
                            key={interest}
                            className="px-3 py-1 bg-[#252422] rounded-full text-xs text-[#d8ff80]"
                        >
                            {interest}
                        </span>
                    ))}
                </div>
            </div>

            <section className={'flex grow gap-5'}>
                <Link
                    to={`./${userID}`}
                    className="flex grow mt-auto bg-[#E7EA5A] hover:bg-[#F5F867] py-2 rounded-lg text-[#121212] font-medium justify-center">
                    View Profile</Link>
                <button
                    onClick={handleRequestConnection}
                    className="flex grow mt-auto bg-[#C0FF00] hover:bg-[#D8FF80] py-2 rounded-lg text-[#121212] font-medium justify-center"
                >
                    Connect
                </button>
            </section>
        </div>
    );
}

export default SuggestedUserCard;