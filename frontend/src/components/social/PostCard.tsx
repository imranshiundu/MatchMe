import { formatDistanceToNow } from 'date-fns';

interface PostProps {
    id: number;
    content: string;
    type: string;
    codeLanguage?: string;
    createdAt: string;
    authorNickname: string;
    authorImageUrl: string;
}

function PostCard({ post }: { post: PostProps }) {
    return (
        <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl p-6 hover:border-[#C0FF00]/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
                <img
                    className="h-12 w-12 rounded-xl object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-colors"
                    src={post.authorImageUrl || '/favicon.svg'}
                    alt={post.authorNickname}
                />
                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#C0FF00] transition-colors">
                        {post.authorNickname}
                    </h3>
                    <p className="text-[#5a6a6a] text-xs font-mono uppercase tracking-tighter">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </div>

            <div className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {post.content}
            </div>

            {post.type === 'code' && post.codeLanguage && (
                <div className="bg-[#121212] border border-[#313030] rounded-xl p-4 font-mono text-xs text-[#C0FF00] overflow-x-auto mb-4">
                    <div className="flex justify-between items-center mb-2 border-b border-[#313030] pb-2">
                        <span className="uppercase tracking-widest text-[10px] font-black">{post.codeLanguage}</span>
                    </div>
                    <code>{post.content}</code>
                </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-[#313030]">
                <button className="flex items-center gap-2 text-[#adaaaa] hover:text-[#C0FF00] transition-colors text-xs font-bold uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Like
                </button>
                <button className="flex items-center gap-2 text-[#adaaaa] hover:text-[#C0FF00] transition-colors text-xs font-bold uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comment
                </button>
            </div>
        </div>
    );
}

export default PostCard;
