import {useState, useEffect} from 'react';
import {useAuth} from "./useAuth";

interface UserData {
    nickname: string;
    imageUrl: string;
}

interface UserProfileInterestDTO {
    id: number;
    interest: string[];
}

interface UserProfileBioDTO {
    id: number;
    bio: string;
}

interface UserDetails {
    nickname: string;
    imageUrl: string;
    interest?: string[];
    bio?: string;
}


export function useFetchUserDetails(userId: number | null) {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAuth();

    useEffect(() => {
        if (!userId) {
            setUserDetails(null);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchAllUserDetails = async () => {
            try {
                if (!userId) throw new Error("User ID is missing.");

                // Fetch all endpoints in parallel
                const [userResponse, profileResponse, bioResponse] = await Promise.all([
                    fetch(`http://localhost:8085/users/${userId}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:8085/users/${userId}/profile`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:8085/users/${userId}/bio`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                ]);

                if (!userResponse.ok || !profileResponse.ok || !bioResponse.ok) {
                    throw new Error("Failed to fetch one or more user details.");
                }

                const userData: UserData = await userResponse.json();
                const profileData: UserProfileInterestDTO = await profileResponse.json();
                const bioData: UserProfileBioDTO = await bioResponse.json();

                const mergedDetails: UserDetails = {
                    nickname: userData.nickname,
                    imageUrl: userData.imageUrl,
                    interest: profileData.interest,
                    bio: bioData.bio
                };

                setUserDetails(mergedDetails);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        };

        fetchAllUserDetails();
    }, [userId, token]);

    return { userDetails, loading, error };
}