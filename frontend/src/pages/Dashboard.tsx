import SuggestedUserCard from '../components/matches/SuggestedUserCard.tsx';
import IncomingRequests from '../components/matches/IncomingRequests.tsx';
import {useState, useEffect} from 'react';

function Dashboard() {
    const [viewSuggestions, setViewSuggestions] = useState<boolean>(true);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);

    useEffect(() => {
        async function getRecommendations(page: number = 0) {
            try {
                setLoading(true);
                const recommendationsRequest = await fetch(`http://localhost:8085/recommendations?page=${page}&size=10`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const recommendationsResponse = await recommendationsRequest.json();
                setRecommendations(recommendationsResponse);
                setCurrentPage(page);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setLoading(false);
            }
        }

        getRecommendations(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        if (recommendations && currentPage < recommendations.pageable.totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div className="text-[#C0FF00] text-xl mt-10">Loading recommendations...</div>;
    }

    return (
        <div className="grid place-items-center p-4">
            {viewSuggestions ? (
                <>
                    <h1 className="text-[#C0FF00] text-2xl mt-5 mb-5">Suggested Users</h1>

                    {recommendations?.ids?.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                                {recommendations.ids.map((userId, index) => (
                                    <SuggestedUserCard key={`${userId}-${index}`} userID={userId}/>
                                ))}
                            </div>

                            <div className="flex justify-center items-center space-x-6 mb-10 fixed bottom-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 0}
                                    className={`px-4 py-2 rounded-lg ${currentPage === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#313030] text-[#C0FF00] hover:bg-[#474646] cursor-pointer'}`}
                                >Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= recommendations.pageable.totalPages - 1}
                                    className={`px-4 py-2 rounded-lg ${currentPage >= recommendations.pageable.totalPages - 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#313030] text-[#C0FF00] hover:bg-[#474646] cursor-pointer'}`}
                                >Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="text-[#adaaaa] text-center text-lg ">No recommendations available </p>
                            <p className="text-[#adaaaa] text-center text-lg ">Maybe because you haven't completed your profile?</p>
                        </div>

                    )}
                </>
            ) : (
                <IncomingRequests/>
            )}

            <section
                className={'flex h-10 w-full sm:w-150 justify-evenly items-center bg-[#313030] text-[#adaaaa] rounded-t-xl text-xl fixed bottom-0'}>
                <button
                    onClick={() => setViewSuggestions(true)}
                    className={`${viewSuggestions ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs' : 'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}`}
                >
                    suggestions
                </button>
                <button
                    onClick={() => setViewSuggestions(false)}
                    className={`${!viewSuggestions ? 'bg-[#C0FF00] text-[#121212] px-4 rounded-xs' : 'hover:bg-[#474646] hover:border-[#C0FF00] border-b-3 border-transparent px-4 transition-all duration-150 rounded-xs'}`}
                >
                    requests
                </button>
            </section>
        </div>
    );
}

export default Dashboard;