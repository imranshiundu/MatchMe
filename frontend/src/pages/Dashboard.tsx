import SuggestedUserCard from '../components/matches/SuggestedUserCard.tsx';
import IncomingRequests from '../components/matches/IncomingRequests.tsx';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';

function Dashboard() {
    const { token } = useAuth();

    const [viewSuggestions, setViewSuggestions] = useState(true);
    const [recommendations, setRecommendations] = useState<{
        ids: number[];
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    async function getRecommendations(page: number = 0) {
        if (!token) {
            setRecommendations(null);
            setError('Please log in again.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const recommendationsRequest = await fetch(
                `http://localhost:8085/recommendations?page=${page}&size=10`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!recommendationsRequest.ok) {
                const errorResponse = await recommendationsRequest.json() as { message?: string };
                throw new Error(errorResponse.message || 'Failed to fetch recommendations');
            }

            const recommendationsResponse = await recommendationsRequest.json();
            setRecommendations(recommendationsResponse);
        } catch (error) {
            setRecommendations(null);
            setError(error instanceof Error ? error.message : 'Failed to fetch recommendations.');
            console.error("Failed to fetch recommendations:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getRecommendations(currentPage);
    }, [currentPage, token]);

    const handleNextPage = () => {
        if (recommendations?.hasNext) {
            setCurrentPage(p => p + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(p => p - 1);
        }
    };

    if (loading) {
        return (
            <div className="text-[#C0FF00] text-center text-xl mt-10">
                Loading recommendations...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen">
            {/* Top Toggle Bar */}
            <div className="flex justify-center my-8 w-full px-4">
                <div className="bg-[#1c1b1b] border-2 border-[#313030] rounded-xl flex overflow-hidden shadow-lg w-full max-w-sm">
                    <button
                        onClick={() => setViewSuggestions(true)}
                        className={`flex-1 py-3 text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer ${viewSuggestions ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:bg-[#313030] hover:text-[#D8FF80]'}`}
                    >
                        SUGGESTIONS
                    </button>
                    <button
                        onClick={() => setViewSuggestions(false)}
                        className={`flex-1 py-3 text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer ${!viewSuggestions ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:bg-[#313030] hover:text-[#D8FF80]'}`}
                    >
                        REQUESTS
                    </button>
                </div>
            </div>

            {viewSuggestions ? (
                <div className="w-full flex flex-col items-center pb-20">

                    {recommendations && recommendations.ids.length > 0 ? (
                        <>
                            <div className="flex flex-wrap justify-center gap-6 mb-8">
                                {recommendations.ids.map((userId: number) => (
                                    <SuggestedUserCard
                                        key={userId}
                                        userID={userId}
                                        refresh={() => getRecommendations(currentPage)}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-center items-center space-x-6 mb-10 sticky bottom-15">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 rounded-lg bg-[#313030] text-[#C0FF00] border-b-3 border-transparent transition-all duration-150 hover:border-[#C0FF00] disabled:opacity-40 disabled:pointer-events-none disabled:border-transparent disabled:hover:border-transparent"
                                >
                                    Previous page
                                </button>

                                <button
                                    onClick={handleNextPage}
                                    disabled={!recommendations?.hasNext}
                                    className="px-4 py-2 rounded-lg bg-[#313030] text-[#C0FF00] border-b-3 border-transparent transition-all duration-150 hover:border-[#C0FF00] disabled:opacity-40 disabled:pointer-events-none disabled:border-transparent disabled:hover:border-transparent"
                                >
                                    Next page
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="text-[#adaaaa] text-center text-lg">
                                {error || 'No recommendations available'}
                            </p>
                            <p className="text-[#adaaaa] text-center text-lg">
                                {error ? 'Complete your profile on the profile page to unlock suggestions.' : "Maybe because you haven't completed your profile?"}
                            </p>
                    )}
                </div>
            ) : (
                <IncomingRequests />
            )}
        </div>
    );
}

export default Dashboard;
