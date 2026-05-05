import { Link } from 'react-router-dom';
import Icon from '../Icon';
import type { FullUserDetails } from '../../hooks/useFetchUserDetails';
import PostCard from '../social/PostCard';

function ViewProfile({
    user,
    buttonHandler,
    buttonText,
    showAllDetails,
    userID,
    posts = [],
}: {
    user: FullUserDetails;
    buttonHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
    buttonText: string;
    showAllDetails: boolean;
    userID?: string | number;
    posts?: any[];
}) {
    const prompts = [
        { q: user.prompt1, a: user.answer1 },
        { q: user.prompt2, a: user.answer2 },
        { q: user.prompt3, a: user.answer3 },
    ].filter(p => p.q && p.a);

    return (
        <div className="max-w-5xl mx-auto w-full space-y-12 animate-fade-in pb-20">
            {/* Hero Section - De-boxed */}
            <div className="relative overflow-hidden">
                <div className="h-48 bg-[#121212] relative rounded-[40px] overflow-hidden border border-[#313030]/20">
                    <div className="absolute inset-0 opacity-10" style={{ 
                        backgroundImage: 'radial-gradient(#C0FF00 1px, transparent 1px)', 
                        backgroundSize: '24px 24px' 
                    }}></div>
                </div>
                
                <div className="px-10 pb-4 -mt-20 flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end gap-8">
                        <img
                            className="h-40 w-40 rounded-full object-cover border-[10px] border-[#121212] shadow-2xl bg-[#121212]"
                            src={user.imageUrl || '/favicon.svg'}
                            alt={user.nickname}
                        />
                        <div className="pb-4">
                            <h1 className="text-5xl font-black text-white tracking-tighter">{user.nickname}</h1>
                            <div className="flex flex-wrap items-center gap-6 mt-3 text-[11px] font-bold uppercase tracking-widest text-[#5a6a6a]">
                                {user.location && (
                                    <span className="flex items-center gap-2 text-[#C0FF00]">
                                        <Icon name="location-icon" size={14} />
                                        {user.location}
                                    </span>
                                )}
                                {showAllDetails && user.age && <span>{user.age} Years</span>}
                                {showAllDetails && user.gender && <span>{user.gender}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pb-4">
                        <button
                            onClick={buttonHandler}
                            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                                buttonText === 'Remove'
                                    ? 'bg-[#121212] text-[#ff7351] border border-[#ff7351]/30 hover:border-[#ff7351]'
                                    : buttonText === 'Edit Profile'
                                    ? 'bg-[#121212] text-[#adaaaa] border border-[#313030] hover:border-[#C0FF00] hover:text-white'
                                    : 'bg-[#C0FF00] text-[#121212] hover:bg-[#A5DB00]'
                            }`}
                        >
                            {buttonText === 'Edit Profile' && <Icon name="edit-icon" size={18} />}
                            {buttonText === 'Connect' ? 'Follow' : buttonText}
                        </button>
                        
                        {!showAllDetails && (
                            <Link
                                to={`/connections/chat/${userID}`}
                                className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#C0FF00] text-[#121212] hover:bg-[#A5DB00] transition-all shadow-xl active:scale-95"
                            >
                                <Icon name="message-icon" size={18} />
                                Message
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-2">
                {/* Left Column - De-boxed */}
                <div className="lg:col-span-1 space-y-12">
                    {user.bio && (
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-[#5a6a6a] uppercase tracking-[0.4em]">About</h3>
                            <p className="text-white/80 text-lg leading-relaxed font-medium">"{user.bio}"</p>
                        </div>
                    )}

                    {(user.interest?.length ?? 0) > 0 && (
                        <div className="space-y-5">
                            <h3 className="text-[10px] font-black text-[#5a6a6a] uppercase tracking-[0.4em]">Interests</h3>
                            <div className="flex flex-wrap gap-3">
                                {user.interest!.map((tag, i) => (
                                    <span key={`${tag}-${i}`} className="px-5 py-2 bg-[#1C1B1B]/50 text-[#C0FF00] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#313030]/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - De-boxed */}
                <div className="lg:col-span-2 space-y-12">
                    {prompts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {prompts.map((p, i) => (
                                <div key={i} className="bg-[#1C1B1B]/30 border border-[#313030]/20 rounded-[32px] p-8 hover:bg-[#1C1B1B]/50 transition-all group">
                                    <h4 className="text-[10px] font-black text-[#C0FF00] uppercase tracking-[0.3em] mb-4 opacity-60">{p.q}</h4>
                                    <p className="text-white text-xl font-bold leading-tight">{p.a}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-[#313030]/30 pb-6">
                            <h2 className="text-white text-xl font-black tracking-tighter">Activity Feed</h2>
                            <span className="text-[#5a6a6a] text-[10px] font-bold tracking-widest">{posts.length} Posts</span>
                        </div>
                        {posts.length > 0 ? (
                            <div className="flex flex-col">
                                {posts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <Icon name="message-icon" size={32} className="text-[#313030] mx-auto mb-6" />
                                <p className="text-[#5a6a6a] text-sm font-medium italic">No posts yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;