import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../Icon';

interface PostProps {
    id: number;
    content: string;
    type: string;
    codeLanguage?: string;
    createdAt: string;
    authorId: number;
    authorNickname: string;
    authorImageUrl: string;
    likesCount: number;
}

function PostCard({ post }: { post: PostProps }) {
    const { token, userId } = useAuth();
    const [followed, setFollowed] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (isFollowing || followed) return;
        
        setIsFollowing(true);
        try {
            const response = await fetch(`http://localhost:8085/${post.authorId}/request`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok || response.status === 409) {
                setFollowed(true);
            }
        } catch (error) {
            console.error("Follow failed:", error);
        } finally {
            setIsFollowing(false);
        }
    };

    const handleLike = async () => {
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
        // Mock API call - should be implemented in backend
        try {
            await fetch(`http://localhost:8085/posts/${post.id}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) {
            console.error("Like failed", e);
        }
    };

    const isOwnPost = userId === post.authorId;
    const avatarUrl = post.authorImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorNickname || post.id}&backgroundColor=121212`;
    const authorName = post.authorNickname || `User ${post.authorId}`;

    return (
        <div className="bg-[#1C1B1B]/40 backdrop-blur-sm border border-[#313030]/30 rounded-[32px] p-6 md:p-8 hover:bg-[#1C1B1B]/60 hover:border-[#C0FF00]/30 transition-all duration-500 group animate-scale-in relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0FF00]/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[#C0FF00]/10 transition-all duration-700" />
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-5">
                    <Link to={`/match/${post.authorId}`} className="relative flex-shrink-0">
                        <img
                            className="h-14 w-14 rounded-full object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-all shadow-xl"
                            src={avatarUrl}
                            alt={authorName}
                        />
                    </Link>
                    <div>
                        <Link to={`/match/${post.authorId}`} className="text-base font-bold text-white hover:text-[#C0FF00] transition-colors block">
                            {authorName}
                        </Link>
                        <p className="text-[#5a6a6a] text-[11px] font-medium mt-1.5 opacity-60">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {!isOwnPost && (
                    <button 
                        onClick={handleFollow}
                        disabled={followed || isFollowing}
                        className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                            followed 
                            ? 'bg-[#1C1B1B] text-[#5a6a6a] border border-[#313030]' 
                            : 'bg-[#C0FF00] text-[#121212] hover:bg-[#A5DB00] shadow-lg'
                        }`}
                    >
                        {isFollowing ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Icon name={followed ? "search-icon" : "connect-icon"} size={12} />
                        )}
                        {followed ? 'Pending' : 'Follow'}
                    </button>
                )}
            </div>

            <div className="text-white/95 text-[16px] leading-relaxed whitespace-pre-wrap mb-6 px-1">
                {post.content}
            </div>

            {post.type === 'code' && post.codeLanguage && (
                <div className="bg-[#121212] border border-[#313030] rounded-2xl p-6 font-mono text-[13px] text-[#C0FF00] overflow-x-auto mb-6 shadow-inner">
                    <div className="flex justify-between items-center mb-4 opacity-40">
                        <span className="uppercase text-[10px] font-bold tracking-widest">{post.codeLanguage} snippet</span>
                    </div>
                    <code className="block leading-relaxed">{post.content}</code>
                </div>
            )}

            <div className="flex items-center gap-10 pt-4">
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2.5 transition-all text-sm font-bold group/btn ${liked ? 'text-[#C0FF00]' : 'text-[#5a6a6a] hover:text-[#C0FF00]'}`}
                >
                    <Icon name="heart-icon" size={18} className={`${liked ? 'scale-110' : 'group-hover/btn:scale-110'} transition-transform`} />
                    {likesCount > 0 ? likesCount : 'Like'}
                </button>
                <button className="flex items-center gap-2.5 text-[#5a6a6a] hover:text-white transition-all text-sm font-bold group/btn">
                    <Icon name="logout-icon" size={18} className="group-hover/btn:scale-110 transition-transform -rotate-90" />
                    Share
                </button>
                <Link to={`/match/${post.authorId}`} className="ml-auto flex items-center gap-2.5 text-[#5a6a6a] hover:text-white transition-all text-sm font-bold">
                    <Icon name="view-profile-icon" size={18} />
                    View Profile
                </Link>
            </div>
        </div>
    );
}

export default PostCard;
