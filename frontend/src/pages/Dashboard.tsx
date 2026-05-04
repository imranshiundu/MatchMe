import SuggestedUserCard from '../components/matches/SuggestedUserCard.tsx';
import IncomingRequests from '../components/matches/IncomingRequests.tsx';
import PostCard from '../components/social/PostCard.tsx';
import CreatePost from '../components/social/CreatePost.tsx';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';

function Dashboard() {
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'requests'>('feed');
    const [recommendations, setRecommendations] = useState<{
        ids: number[];
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const getRecommendations = useCallback(async (page: number = 0) => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8085/recommendations?page=${page}&size=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRecommendations(data);
            } else {
                setRecommendations(null);
            }
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const getPosts = useCallback(async (page: number = 0) => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8085/posts?page=${page}&size=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data.content);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === 'discover') {
            getRecommendations(currentPage);
        } else if (activeTab === 'feed') {
            getPosts(0);
        } else {
            setLoading(false);
        }
    }, [activeTab, currentPage, getRecommendations, getPosts]);

    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-8">
            {/* Social Header / Tabs */}
            <div className="flex flex-col gap-8 mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-white text-4xl font-black uppercase tracking-tighter">
                            {activeTab === 'feed' ? 'Global Feed' : activeTab === 'discover' ? 'Find Matches' : 'Requests'}
                        </h1>
                        <p className="text-[#adaaaa] text-sm mt-1 font-mono">// meet, collaborate, build</p>
                    </div>

                    <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl flex p-1 shadow-2xl">
                        <button
                            onClick={() => { setActiveTab('feed'); setCurrentPage(0); }}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:text-white'}`}
                        >
                            Feed
                        </button>
                        <button
                            onClick={() => { setActiveTab('discover'); setCurrentPage(0); }}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'discover' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:text-white'}`}
                        >
                            Discover
                        </button>
                        <button
                            onClick={() => { setActiveTab('requests'); setCurrentPage(0); }}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#adaaaa] hover:text-white'}`}
                        >
                            Requests
                        </button>
                    </div>
                </div>
            </div>

            {loading && activeTab !== 'requests' ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-8 h-8 border-4 border-[#C0FF00] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[#adaaaa] text-xs font-mono tracking-widest uppercase">Syncing with grid...</p>
                </div>
            ) : (
                <div className="w-full">
                    {activeTab === 'feed' && (
                        <div className="flex flex-col gap-6">
                            <CreatePost onPostCreated={() => getPosts(0)} />
                            {posts.length > 0 ? (
                                posts.map(post => <PostCard key={post.id} post={post} />)
                            ) : (
                                <div className="bg-[#1C1B1B] border-2 border-[#313030] border-dashed rounded-3xl py-20 flex flex-col items-center justify-center text-center px-8">
                                    <h3 className="text-white text-xl font-bold mb-2">The grid is quiet</h3>
                                    <p className="text-[#adaaaa] max-w-xs text-sm">Be the first to share a code snippet or a developer thought.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'discover' && (
                        <div className="flex flex-col items-center gap-8">
                            {recommendations && recommendations.ids.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                        {recommendations.ids.map((userId: number) => (
                                            <SuggestedUserCard
                                                key={userId}
                                                userID={userId}
                                                refresh={() => getRecommendations(currentPage)}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 mt-8">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                            disabled={currentPage === 0}
                                            className="px-6 py-2 bg-[#313030] text-[#C0FF00] rounded-xl font-bold disabled:opacity-30 transition-all active:scale-95"
                                        >
                                            Prev
                                        </button>
                                        <span className="text-[#adaaaa] font-mono text-sm">PAGE {currentPage + 1}</span>
                                        <button
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            disabled={!recommendations?.hasNext}
                                            className="px-6 py-2 bg-[#313030] text-[#C0FF00] rounded-xl font-bold disabled:opacity-30 transition-all active:scale-95"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-[#1C1B1B] border-2 border-[#313030] border-dashed rounded-3xl py-20 flex flex-col items-center justify-center text-center px-8 w-full">
                                    <div className="w-16 h-16 bg-[#252422] rounded-3xl flex items-center justify-center mb-6 text-2xl">🔍</div>
                                    <h3 className="text-white text-xl font-bold mb-2">No recommendations yet</h3>
                                    <p className="text-[#adaaaa] max-w-xs text-sm mb-6">Complete your profile with a nickname and bio to unlock the matching algorithm.</p>
                                    <a href="/profile" className="px-6 py-3 bg-[#C0FF00] text-[#121212] rounded-xl font-bold hover:bg-[#D8FF80] transition-all active:scale-95">
                                        Complete Profile
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && <IncomingRequests />}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
