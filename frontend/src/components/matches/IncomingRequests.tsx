import RequestCard from '../matches/RequestCard.tsx'
import {useState, useEffect} from 'react';
import {useAuth} from "../../hooks/useAuth";

type RequestAction = 'accepted' | 'rejected';

function IncomingRequests() {
    const [requests, setRequests] = useState<Array<{ id: number; userA: number }>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);

    const { token } = useAuth();
    useEffect(() => {
        async function fetchConnectionRequests() {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8085/connection-requests', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    setError('Failed to fetch connection requests');
                    return;
                }

                const data = await response.json();
                setRequests(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error("Failed to fetch connection requests:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchConnectionRequests();
    }, [token]);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [toast]);

    const handleRequestActionResult = (
        requestID: number,
        action: RequestAction,
        success: boolean,
        errorMessage?: string
    ) => {
        if (success) {
            setRequests((currentRequests) => currentRequests.filter((request) => request.id !== requestID));
            setToast({
                message: action === 'accepted' ? 'Connection request accepted.' : 'Connection request rejected.',
                kind: 'success'
            });
            return;
        }

        setToast({
            message: errorMessage || `Failed to ${action === 'accepted' ? 'accept' : 'reject'} connection request.`,
            kind: 'error'
        });
    };

    if (loading) {
        return <div className="text-[#C0FF00] text-xl mt-10">Loading requests...</div>;
    }

    if (error) {
        return <div className="text-[#ff7351] text-xl mt-10">Error: {error}</div>;
    }

    if (requests.length === 0) {
        return <div className="text-[#adaaaa] text-xl mt-10">No connection requests</div>;
    }

    return (
        <>
            {toast && (
                <div
                    className={`fixed right-5 top-5 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${toast.kind === 'success' ? 'bg-[#1f3b1f] text-[#C0FF00]' : 'bg-[#3b1f1f] text-[#ff7351]'}`}
                >
                    {toast.message}
                </div>
            )}
            <h1 className='text-[#C0FF00] text-2xl mt-5 mb-5'>Connection Requests</h1>
            <div className={'flex flex-col gap-4'}>
                {requests.map((request) => (
                    <RequestCard
                        key={request.id}
                        requestID={request.id}
                        userID={request.userA}
                        onActionResult={handleRequestActionResult}
                    />
                ))}
            </div>
        </>
    );
}

export default IncomingRequests