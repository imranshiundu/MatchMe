import {useState, useEffect} from 'react';
import {useAuth} from "../../hooks/useAuth";

type RequestCardProps = {
    requestID: number;
    userID: number;
    onActionResult: (requestID: number, action: 'accepted' | 'rejected', success: boolean, errorMessage?: string) => void;
};

function RequestCard({requestID, userID, onActionResult}: RequestCardProps) {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userDetails, setUserDetails] = useState({
        nickname: '',
        imageUrl: null as string | null
    });
    useEffect(() => {
        async function getUserDetails(id: number) {
            try {
                const fetchedUserNameAndPicture = await fetch(`http://localhost:8085/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
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
    }, [token, userID]);


    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8085/connection-requests/${requestID}/accept`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                onActionResult(requestID, 'accepted', false, 'Failed to accept connection request');
                return;
            }
            onActionResult(requestID, 'accepted', true);
        } catch (error) {
            console.error('Error accepting connection request:', error);
            const message = error instanceof Error ? error.message : 'Failed to accept connection request';
            onActionResult(requestID, 'accepted', false, message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8085/connection-requests/${requestID}/dismiss`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                onActionResult(requestID, 'rejected', false, 'Failed to reject connection request');
                return;
            }
            onActionResult(requestID, 'rejected', true);
        } catch (error) {
            console.error('Error rejecting connection request:', error);
            const message = error instanceof Error ? error.message : 'Failed to reject connection request';
            onActionResult(requestID, 'rejected', false, message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={'bg-[#1c1b1b] rounded-lg flex items-center p-3'}>
            <div className={'h-12 w-12 rounded-lg inline-block'}>
                <img
                    className={'h-full w-full rounded-lg object-cover border-2 border-[#FFFCF2]'}
                        src={userDetails.imageUrl ?? '/favicon.svg'}
                    alt="Profile"
                />
            </div>
            <p className={'mx-3 flex-1 cursor-auto text-lg text-[#FFFCF2]'}>{userDetails.nickname}</p>
            <button
                onClick={() => handleReject()}
                disabled={isSubmitting}
                className={'text-[#FAE44C] hover:text-[#FFF2AB] hover:bg-[#313030] px-3 py-1 rounded-xl cursor-pointer transition-colors'}
            >
                Reject
            </button>
            <button
                onClick={() => handleAccept()}
                disabled={isSubmitting}
                className={'text-[#C0FF00] hover:text-[#D8FF80] hover:bg-[#313030] ml-2 px-3 py-1 rounded-xl cursor-pointer transition-colors'}
            >
                Accept
            </button>
        </div>
    );
}


export default RequestCard;