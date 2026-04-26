import {useState, useEffect} from 'react';

interface UserData {
    nickname: string;
    imageUrl: string;
}

export function useFetchNameAndPicture(userId: number) {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!userId) throw new Error("User ID is missing.");

                const response = await fetch(`http://localhost:8085/users/${userId}`, {
                        method: 'GET',
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    }
                )
                if (!response.ok) {
                    throw new Error(`Failed to fetch user: ${response.statusText}`);
                }
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch user data")
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);
    return { userData, loading, error};
}