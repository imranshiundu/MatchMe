import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Post {
    id: number;
    content: string;
    type: string;
    codeLanguage?: string;
    createdAt: string;
    authorId: number;
    authorNickname: string;
    authorImageUrl: string;
}

export function useFetchUserPosts(userId: number | null) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!userId || !token) return;

        async function fetchPosts() {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8085/posts/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch user posts');
                const data = await res.json();
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error fetching posts');
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, [userId, token]);

    return { posts, loading, error };
}
