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
        <div className="max-w-3xl mx-auto w-full space-y-4">
            {/* Hero Card */}
            <div className="bg-[#1C1B1B] border border-[#313030] rounded-2xl overflow-hidden">
                {/* Cover gradient */}
                <div className="h-24 bg-gradient-to-r from-[#C0FF00]/10 via-[#313030] to-[#1C1B1B]" />
                
                {/* Avatar + actions row */}
                <div className="px-6 pb-6 -mt-12 flex items-end justify-between gap-4 flex-wrap">
                    <img
                        className="h-24 w-24 rounded-2xl object-cover border-4 border-[#1C1B1B] shadow-xl"
                        src={user.imageUrl || '/favicon.svg'}
                        alt={user.nickname}
                    />
                    <div className="flex items-center gap-3 pb-1">
                        <button
                            onClick={buttonHandler}
                            className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                buttonText === 'Remove'
                                    ? 'bg-[#313030] text-[#ff7351] fill-[#ff7351] hover:bg-[#3a1f1f]'
                                    : buttonText === 'Edit Profile'
                                    ? 'bg-[#313030] text-[#C0FF00] fill-[#C0FF00] hover:bg-[#252422]'
                                    : 'bg-[#C0FF00] text-[#121212] fill-[#121212] hover:bg-[#a5db00]'
                            }`}
                        >
                            {buttonText === 'Edit Profile' && <Icon name="edit-icon" size={16} />}
                            {buttonText === 'Remove' && <Icon name="remove-icon" size={16} />}
                            {buttonText === 'Connect' && <Icon name="connect-icon" size={16} />}
                            <span>{buttonText}</span>
                        </button>
                        {buttonText === 'Remove' && (
                            <Link
                                to={`/connections/chat/${userID}`}
                                className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#313030] text-[#C0FF00] fill-[#C0FF00] hover:bg-[#252422] transition-all active:scale-95"
                            >
                                <Icon name="message-icon" size={16} />
                                <span>Message</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Name & meta */}
                <div className="px-6 pb-6">
                    <h1 className="text-2xl font-bold text-white mb-1">{user.nickname}</h1>
                    {showAllDetails && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#adaaaa]">
                            {user.age && <span>{user.age} years old</span>}
                            {user.gender && <span className="capitalize">{user.gender}</span>}
                            {user.location && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    {user.location}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bio */}
            {user.bio && (
                <div className="bg-[#1C1B1B] border border-[#313030] rounded-2xl p-6">
                    <p className="text-xs font-bold text-[#C0FF00] uppercase tracking-widest mb-3">About</p>
                    <p className="text-[#FFFCF2] leading-relaxed whitespace-pre-wrap">{user.bio}</p>
                </div>
            )}

            {/* Prompts */}
            {prompts.length > 0 && (
                <div className="space-y-3">
                    {prompts.map((p, i) => (
                        <div key={i} className="bg-[#1C1B1B] border border-[#313030] rounded-2xl p-6">
                            <p className="text-xs font-bold text-[#C0FF00] uppercase tracking-widest mb-2">{p.q}</p>
                            <p className="text-white text-lg leading-snug">{p.a}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Interests + Looking For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(user.interest?.length ?? 0) > 0 && (
                    <div className="bg-[#1C1B1B] border border-[#313030] rounded-2xl p-6">
                        <p className="text-xs font-bold text-[#C0FF00] uppercase tracking-widest mb-3">Tech Stack</p>
                        <div className="flex flex-wrap gap-2">
                            {user.interest!.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-[#252422] text-sm text-[#D8FF80] rounded-full border border-[#313030]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {showAllDetails && (user.lookingFor?.length ?? 0) > 0 && (
                    <div className="bg-[#1C1B1B] border border-[#313030] rounded-2xl p-6">
                        <p className="text-xs font-bold text-[#C0FF00] uppercase tracking-widest mb-3">Looking For</p>
                        <div className="flex flex-wrap gap-2">
                            {user.lookingFor!.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-[#252422] text-sm text-[#D8FF80] rounded-full border border-[#313030]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Geo radius — only for own profile */}
            {showAllDetails && user.radius && (
                <div className="bg-[#1C1B1B] border border-[#313030] rounded-2xl p-6">
                    <p className="text-xs font-bold text-[#C0FF00] uppercase tracking-widest mb-2">Match Radius</p>
                    <p className="text-white text-lg">{user.radius} km</p>
                    {user.latitude && user.longitude && (
                        <p className="text-xs text-[#adaaaa] mt-1">
                            Coords: {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                        </p>
                    )}
                </div>
            )}

            {/* Recent Activity (Posts) */}
            <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between border-b border-[#313030] pb-4">
                    <h2 className="text-[#C0FF00] text-xl font-black uppercase tracking-tighter">Recent Activity</h2>
                    <span className="text-[#5a6a6a] text-xs font-mono">[{posts.length} POSTS]</span>
                </div>
                {posts.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#1C1B1B] border border-[#313030] border-dashed rounded-2xl p-10 text-center">
                        <p className="text-[#adaaaa] text-sm italic">No recent posts from this user.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewProfile;