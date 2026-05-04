import RequestCard from '../matches/RequestCard.tsx'
import { useState, useEffect } from 'react';
import { useAuth } from "../../hooks/useAuth";

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
        if (!toast) return;
        const timeoutId = setTimeout(() => setToast(null), 3000);
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
                message: action === 'accepted' ? 'Developer added to network.' : 'Request dismissed.',
                kind: 'success'
            });
            return;
        }

        setToast({
            message: errorMessage || `Failed to ${action === 'accepted' ? 'accept' : 'reject'} request.`,
            kind: 'error'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-8 h-8 border-2 border-[#C0FF00] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#adaaaa] text-sm font-mono tracking-widest uppercase">Fetching inbound requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[#ff7351] text-lg font-bold">Failed to load requests</p>
                <p className="text-[#adaaaa] text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
            {toast && (
                <div
                    className={`fixed right-6 top-6 z-[100] rounded-2xl px-6 py-4 text-sm font-bold shadow-2xl border-2 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
                        toast.kind === 'success' 
                            ? 'bg-[#121212] border-[#C0FF00] text-[#C0FF00]' 
                            : 'bg-[#121212] border-[#ff7351] text-[#ff7351]'
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${toast.kind === 'success' ? 'bg-[#C0FF00]' : 'bg-[#ff7351]'} animate-pulse`} />
                    {toast.message}
                </div>
            )}

            <div className="flex items-baseline justify-between mb-8 border-b border-[#313030] pb-6">
                <h1 className="text-[#C0FF00] text-3xl font-black uppercase tracking-tighter">Requests</h1>
                <span className="text-[#adaaaa] text-xs font-mono tracking-widest">[{requests.length} PENDING]</span>
            </div>

            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <RequestCard
                            key={request.id}
                            requestID={request.id}
                            userID={request.userA}
                            onActionResult={handleRequestActionResult}
                        />
                    ))
                ) : (
                    <div className="bg-[#1C1B1B] border-2 border-[#313030] border-dashed rounded-3xl py-20 flex flex-col items-center justify-center text-center px-8">
                        <div className="w-16 h-16 bg-[#252422] rounded-3xl flex items-center justify-center mb-6 text-2xl">
                            👋
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">Inbox Empty</h3>
                        <p className="text-[#adaaaa] max-w-xs text-sm">When other developers want to connect, you'll see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IncomingRequests;