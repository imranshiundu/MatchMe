import SuggestedUserCard from '../components/matches/SuggestedUserCard.tsx';
import IncomingRequests from '../components/matches/IncomingRequests.tsx';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';

function Dashboard() {
    const { token } = useAuth();

    const [viewSuggestions, setViewSuggestions] = useState(true);
    const [recommendations, setRecommendations] = useState<any>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    async function getRecommendations(page: number = 0) {
        try {
            setLoading(true);

            const recommendationsRequest = await fetch(
                `http://localhost:8085/recommendations?page=${page}&size=10`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const recommendationsResponse = await recommendationsRequest.json();
            setRecommendations(recommendationsResponse);

        } catch (error) {
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
        <div className="grid place-items-center p-4">

            {viewSuggestions ? (
                <>
                    <h1 className="text-[#C0FF00] text-2xl mt-5 mb-5">
                        Suggested Users
                    </h1>

                    {recommendations?.ids?.length > 0 ? (
                        <>
                            <div className="flex flex-wrap justify-center gap-6 mb-8">
                                {recommendations.ids.map((userId) => (
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
                                No recommendations available
                            </p>
                            <p className="text-[#adaaaa] text-center text-lg">
                                Maybe because you haven't completed your profile?
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <IncomingRequests />
            )}

            <section className="flex h-10 w-full sm:w-150 justify-evenly items-center bg-[#313030] text-[#adaaaa] rounded-t-xl text-xl fixed bottom-0">
                <button
                    onClick={() => setViewSuggestions(true)}
                    className={viewSuggestions ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs' : 'px-4'}
                >
                    suggestions
                </button>

                <button
                    onClick={() => setViewSuggestions(false)}
                    className={!viewSuggestions ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs' : 'px-4'}
                >
                    requests
                </button>
            </section>

        </div>
    );
}

export default Dashboard;