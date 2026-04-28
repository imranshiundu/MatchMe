import RequestCard from '../matches/RequestCard.tsx'
import {useState, useEffect} from 'react';
import {useAuth} from "../../hooks/useAuth";
function IncomingRequests() {
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                    throw new Error('Failed to fetch connection requests');
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
    }, []);

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
            <h1 className='text-[#C0FF00] text-2xl mt-5 mb-5'>Connection Requests</h1>
            <div className={'flex flex-col gap-4'}>
                {requests.map((request, index) => (
                    <RequestCard
                        key={`${request.userA}-${index}`}
                        userID={request.userA}
                    />
                ))}
            </div>
        </>
    );
}

export default IncomingRequests