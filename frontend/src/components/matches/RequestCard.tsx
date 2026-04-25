import {useState, useEffect} from 'react';

function RequestCard({userID}) {

    const [userDetails, setUserDetails] = useState({
        nickname: '',
        imageUrl: ''
    });
    useEffect(() => {
        async function getUserDetails(userID) {
            try {
                const fetchedUserNameAndPicture = await fetch(`http://localhost:8085/users/${userID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const userNameAndPicture = await fetchedUserNameAndPicture.json();
                setUserDetails(userNameAndPicture);
            }
            catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        }
        getUserDetails(userID);
    }, []);


    const handleAccept = async () => {
        try {
            const response = await fetch(`http://localhost:8085/${userID}/accept`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to accept connection request');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error accepting connection request:', error);
        }
    };

    const handleReject = async () => {
        try {
            const response = await fetch(`http://localhost:8085/${userID}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reject connection request');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error rejecting connection request:', error);
        }
    };

    return (
        <div className={'bg-[#1c1b1b] rounded-lg flex items-center p-3'}>
            <div className={'h-12 w-12 rounded-lg inline-block'}>
                <img
                    className={'h-full w-full rounded-lg object-cover border-2 border-[#FFFCF2]'}
                    src={userDetails.imageUrl}
                    alt="Profile"
                />
            </div>
            <p className={'mx-3 flex-1 cursor-auto text-lg text-[#FFFCF2]'}>{userDetails.nickname}</p>
            <button
                onClick={() => handleReject()}
                className={'text-[#FAE44C] hover:text-[#FFF2AB] hover:bg-[#313030] px-3 py-1 rounded-xl cursor-pointer transition-colors'}
            >
                Reject
            </button>
            <button
                onClick={() => handleAccept()}
                className={'text-[#C0FF00] hover:text-[#D8FF80] hover:bg-[#313030] ml-2 px-3 py-1 rounded-xl cursor-pointer transition-colors'}
            >
                Accept
            </button>
        </div>
    );
}


export default RequestCard;