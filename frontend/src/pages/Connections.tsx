import { useState, useEffect, useCallback } from 'react';
import ConnectionCard from '../components/chat/ConnectionCard.tsx';
import SuggestedUserCard from '../components/matches/SuggestedUserCard.tsx';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon.tsx';

function Connections() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<'following' | 'recommended'>('following');
    const [following, setFollowing] = useState<any[]>([]);
    const [recommendedIds, setRecommendedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const loadConnections = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const connectionsRes = await fetch('http://localhost:8085/connections', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (connectionsRes.ok) {
                const connections = await connectionsRes.json();
                
                // Fetch full details for connections
                const enriched = await Promise.all(
                    connections.map(async (conn: any) => {
                        const userRes = await fetch(`http://localhost:8085/users/${conn.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        return userRes.ok ? await userRes.json() : null;
                    })
                );
                setFollowing(enriched.filter(Boolean));
            }
        } catch (error) {
            console.error("Failed to load connections", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const loadRecommendations = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8085/recommendations?page=0&size=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRecommendedIds(data.ids || []);
            }
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === 'following') {
            loadConnections();
        } else {
            loadRecommendations();
        }
    }, [activeTab, loadConnections, loadRecommendations]);

    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-8 animate-fade-in">
            <div className="mb-10">
                <h1 className="text-white text-4xl font-black tracking-tighter">Network</h1>
                <p className="text-[#5a6a6a] text-sm font-medium mt-3">Manage your professional connections and discover new talent.</p>
            </div>

            <div className="mb-8 border-b border-[#313030]/50">
                <div className="flex gap-10">
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'following' ? 'text-[#C0FF00]' : 'text-[#5a6a6a] hover:text-white'}`}
                    >
                        Following
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#1C1B1B] text-[10px]">{following.length}</span>
                        {activeTab === 'following' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0FF00] shadow-[0_0_10px_#C0FF00]"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('recommended')}
                        className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'recommended' ? 'text-[#C0FF00]' : 'text-[#5a6a6a] hover:text-white'}`}
                    >
                        Recommended for You
                        {activeTab === 'recommended' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0FF00] shadow-[0_0_10px_#C0FF00]"></div>}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#C0FF00] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : activeTab === 'following' ? (
                <div className="bg-[#1C1B1B]/40 border border-[#313030]/30 rounded-[32px] overflow-hidden">
                    {following.length > 0 ? (
                        <div className="flex flex-col divide-y divide-[#313030]/30">
                            {following.map((user) => (
                                <ConnectionCard
                                    key={user.id}
                                    userId={user.id}
                                    nickname={user.nickname}
                                    imageUrl={user.imageUrl}
                                    bio={user.bio}
                                    latestMessage={null}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                            <div className="w-20 h-20 bg-[#121212] border border-[#313030] rounded-full flex items-center justify-center mb-6">
                                <Icon name="connect-icon" size={32} className="text-[#5a6a6a]" />
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">You aren't following anyone</h3>
                            <p className="text-[#5a6a6a] max-w-xs text-sm mb-8">Follow developers to see their updates in your feed and connect.</p>
                            <button 
                                onClick={() => setActiveTab('recommended')}
                                className="px-8 py-3 bg-[#C0FF00] text-[#121212] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#A5DB00] transition-all"
                            >
                                Find People
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {recommendedIds.length > 0 ? (
                        recommendedIds.map((id) => (
                            <SuggestedUserCard key={id} userID={id} refresh={loadRecommendations} />
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 py-24 text-center">
                            <p className="text-[#5a6a6a]">No recommendations found at the moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Connections;