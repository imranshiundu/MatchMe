import {useState, useEffect} from 'react';

function SuggestedUserCard({userID}) {

    const [userDetails, setUserDetails] = useState<object>({
        nickname: '',
        interest:[],
        imageUrl: null
    })
    useEffect(() => {
        async function getUserDetails(userID) {
            try {
                // user nickname and pfp
                const fetchedUserNameAndPicture = await fetch(`http://localhost:8085/users/${userID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const userNameAndPicture = await fetchedUserNameAndPicture.json();

                // user interests
                const fetchedUserInterests = await fetch(`http://localhost:8085/users/${userID}/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const userInterests = await fetchedUserInterests.json();

                // merge details
                setUserDetails(prev => ({
                    ...prev,
                    nickname: userNameAndPicture.nickname,
                    imageUrl: userNameAndPicture.imageUrl,
                    interest: userInterests.interest
                }))
            }
            catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        }
        getUserDetails(userID);
    }, []);

    const handleRequestConnection = async (userID) => {
        try {
            const response = await fetch(`http://localhost:8085/${userID}/request`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send connection request');
            }
            console.log('Connection request sent successfully');
        } catch (error) {
            console.error('Error sending connection request:', error);
        }
    };

    return (
        <div className="bg-[#252422] rounded-2xl p-6 w-80">
            <div className="flex items-center space-x-4 mb-4">
                <img
                    className="h-20 w-20 rounded-xl object-cover border-2 border-[#eaffb8]"
                    src={userDetails.imageUrl}
                    alt="Profile"
                />
                <div className="flex-1">
                    <h2 className="text-2xl">{userDetails.nickname}</h2>
                </div>
            </div>

            <div className="mb-5">
                <h3 className="text-[#D8FF80] text-sm font-medium mb-2">//common interests</h3>
                <div className="flex flex-wrap gap-2">
                    {userDetails.interest?.map((interest) => (
                        <span
                            key={interest}
                            className="px-3 py-1 bg-[#1C1B1B] rounded-full text-[#d8ff80] text-xs border border-[#3a3a3a]"
                        >
                        {interest}
                    </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handleRequestConnection(userID)}
                    className="bg-[#C0FF00] hover:bg-[#D8FF80] px-4 py-2 rounded-lg text-[#121212] font-medium transition-colors duration-200">
                    Connect
                </button>
            </div>
        </div>
    )
}

export default SuggestedUserCard;