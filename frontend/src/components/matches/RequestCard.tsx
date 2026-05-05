import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import Icon from "../Icon";

type RequestCardProps = {
    requestID: number;
    userID: number;
    onActionResult: (requestID: number, action: 'accepted' | 'rejected', success: boolean, errorMessage?: string) => void;
};

function RequestCard({ requestID, userID, onActionResult }: RequestCardProps) {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userDetails, setUserDetails] = useState({
        nickname: '',
        imageUrl: null as string | null,
        bio: ''
    });

    useEffect(() => {
        async function getUserDetails(id: number) {
            try {
                const res = await fetch(`http://localhost:8085/profile/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setUserDetails({
                    nickname: data.nickname,
                    imageUrl: data.imageUrl,
                    bio: data.bio
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        }
        getUserDetails(userID);
    }, [token, userID]);

    const handleAction = async (action: 'accept' | 'dismiss') => {
        setIsSubmitting(true);
        const endpoint = action === 'accept' ? 'accept' : 'dismiss';
        try {
            const response = await fetch(`http://localhost:8085/connection-requests/${requestID}/${endpoint}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                onActionResult(requestID, action === 'accept' ? 'accepted' : 'rejected', false, `Failed to ${action} request`);
                return;
            }
            onActionResult(requestID, action === 'accept' ? 'accepted' : 'rejected', true);
        } catch (error) {
            onActionResult(requestID, action === 'accept' ? 'accepted' : 'rejected', false, 'Server error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:border-[#C0FF00]/30 transition-all group">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <img
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-colors shadow-xl"
                    src={userDetails.imageUrl ?? '/favicon.svg'}
                    alt={userDetails.nickname}
                />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
                <h3 className="text-xl font-bold text-white group-hover:text-[#C0FF00] transition-colors mb-1 truncate">
                    {userDetails.nickname || 'Developer'}
                </h3>
                {userDetails.bio && (
                    <p className="text-sm text-[#adaaaa] line-clamp-2 italic mb-2">
                        "{userDetails.bio}"
                    </p>
                )}
                <Link 
                    to={`/match/${userID}`} 
                    className="text-[10px] font-black uppercase tracking-widest text-[#5a6a6a] hover:text-[#C0FF00] transition-colors"
                >
                    View Full Profile →
                </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                    onClick={() => handleAction('dismiss')}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none flex items-center justify-center w-12 h-12 rounded-xl bg-[#313030] fill-[#adaaaa] hover:bg-[#3a1f1f] hover:fill-[#ff7351] transition-all disabled:opacity-50"
                    title="Reject"
                >
                    <Icon name="reject-icon" size={20} />
                </button>
                <button
                    onClick={() => handleAction('accept')}
                    disabled={isSubmitting}
                    className="flex-[2] sm:flex-none flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#C0FF00] text-[#121212] fill-[#121212] font-bold text-sm hover:bg-[#D8FF80] transition-all active:scale-95 disabled:opacity-50"
                >
                    <Icon name="accept-icon" size={18} />
                    <span>Accept</span>
                </button>
            </div>
        </div>
    );
}

export default RequestCard;