import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
    const { token } = useAuth();
    const [content, setContent] = useState('');
    const [type, setType] = useState('text');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
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
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex gap-4">
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share a code snippet or a thought..."
                        className="w-full bg-[#121212] border-2 border-[#313030] rounded-xl p-4 text-white text-sm outline-none focus:border-[#C0FF00] transition-all resize-none min-h-[100px]"
                    />
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setType('text')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === 'text' ? 'bg-[#C0FF00] text-[#121212]' : 'bg-[#313030] text-[#adaaaa] hover:text-white'}`}
                            >
                                Text
                            </button>
                            <button
                                onClick={() => setType('code')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === 'code' ? 'bg-[#C0FF00] text-[#121212]' : 'bg-[#313030] text-[#adaaaa] hover:text-white'}`}
                            >
                                Code
                            </button>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className="px-6 py-2 bg-[#C0FF00] text-[#121212] rounded-xl font-bold text-sm hover:bg-[#D8FF80] disabled:opacity-50 transition-all active:scale-95"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
