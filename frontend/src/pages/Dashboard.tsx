import SuggestedUserCard from '../components/matches/SuggestedUserCard.tsx';
import IncomingRequests from '../components/matches/IncomingRequests.tsx';
import PostCard from '../components/social/PostCard.tsx';
import CreatePost from '../components/social/CreatePost.tsx';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import Icon from '../components/Icon.tsx';

function Dashboard() {
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState<'feed' | 'requests'>('feed');
    const [recommendations, setRecommendations] = useState<{
        ids: number[];
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
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
            const res = await fetch(`http://localhost:8085/posts?page=${page}&size=15&discover=true`, {
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
        <div className="max-w-4xl mx-auto w-full px-4 py-8 animate-fade-in">
            {/* Professional Tabs Header */}
            <div className="mb-8 border-b border-[#313030]">
                <div className="flex gap-12 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => { setActiveTab('feed'); setCurrentPage(0); }}
                        className={`pb-4 text-[13px] font-bold transition-all relative flex items-center gap-2 ${activeTab === 'feed' ? 'text-[#C0FF00]' : 'text-[#5a6a6a] hover:text-white'}`}
                    >
                        <Icon name="message-icon" size={16} />
                        Feed
                        {activeTab === 'feed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0FF00] shadow-[0_0_10px_#C0FF00]"></div>}
                    </button>

                    <button
                        onClick={() => { setActiveTab('requests'); setCurrentPage(0); }}
                        className={`pb-4 text-[13px] font-bold transition-all relative flex items-center gap-2 ${activeTab === 'requests' ? 'text-[#C0FF00]' : 'text-[#5a6a6a] hover:text-white'}`}
                    >
                        <Icon name="connect-icon" size={16} />
                        Requests
                        {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0FF00] shadow-[0_0_10px_#C0FF00]"></div>}
                    </button>
                </div>
            </div>

            {loading && activeTab !== 'requests' ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-10 h-10 border-2 border-[#C0FF00] border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="text-[#5a6a6a] text-[10px] font-black uppercase tracking-[0.3em]">Accessing Data...</p>
                </div>
            ) : (
                <div className="w-full">
                    {activeTab === 'feed' && (
                        <div className="flex flex-col gap-6">
                            <CreatePost onPostCreated={() => getPosts(0)} />
                            {posts.length > 0 ? (
                                posts.map(post => <PostCard key={post.id} post={post} />)
                            ) : (
                                <div className="bg-[#1C1B1B] border border-[#313030] border-dashed rounded-3xl py-32 flex flex-col items-center justify-center text-center px-8 shadow-xl">
                                    <div className="w-20 h-20 bg-[#121212] rounded-full flex items-center justify-center mb-8 border border-[#313030]">
                                        <Icon name="message-icon" size={32} className="text-[#313030]" />
                                    </div>
                                    <h3 className="text-white text-2xl font-black mb-3">Feed is Offline</h3>
                                    <p className="text-[#adaaaa] max-w-sm text-sm font-medium leading-relaxed">The social hub is quiet. Be the first to publish a thought or share a recent breakthrough.</p>
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
