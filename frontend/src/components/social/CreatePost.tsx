import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../Icon';

function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
    const { token, userEmail } = useAuth();
    const [content, setContent] = useState('');
    const [type, setType] = useState('text');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail || 'me'}`);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await fetch('http://localhost:8085/me/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.imageUrl) setAvatarUrl(data.imageUrl);
                }
            } catch (e) {
                console.error("Failed to load profile for avatar", e);
            }
        };
        fetchProfile();
    }, [token]);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        setErrorMsg('');
        try {
            const res = await fetch('http://localhost:8085/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content,
                    type,
                    codeLanguage: type === 'code' ? 'javascript' : null
                })
            });

            if (res.ok) {
                setContent('');
                onPostCreated();
            } else {
                setErrorMsg('Failed to post. Please try again.');
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            setErrorMsg('Network error. Is the server running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-10 animate-fade-in px-4">
            <div className="flex gap-6">
                <div className="flex-shrink-0">
                    <img 
                        src={avatarUrl} 
                        alt="User" 
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#313030]" 
                    />
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`What's on your mind?`}
                        className="w-full bg-transparent text-white text-xl outline-none resize-none min-h-[100px] placeholder-[#5a6a6a] font-medium leading-relaxed"
                    />
                    
                    {errorMsg && (
                        <div className="mb-4 text-[#ff7351] text-xs font-bold px-4 py-2 bg-[#ff7351]/10 rounded-lg border border-[#ff7351]/20">
                            {errorMsg}
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4 pt-6 border-t border-[#313030]/20">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setType('text')}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'text' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#5a6a6a] hover:text-white'}`}
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setType('code')}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'code' ? 'bg-[#C0FF00] text-[#121212]' : 'text-[#5a6a6a] hover:text-white'}`}
                            >
                                Code
                            </button>
                        </div>
                        
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className="px-10 py-3 bg-[#C0FF00] text-[#121212] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#A5DB00] disabled:opacity-20 transition-all shadow-xl active:scale-95"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Post"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
