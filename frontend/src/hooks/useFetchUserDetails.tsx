import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface FullUserDetails {
    id?: number;
    email?: string;
    nickname: string;
    imageUrl: string;
    bio?: string;
    age?: number | null;
    gender?: string;
    location?: string;
    latitude?: number | null;
    longitude?: number | null;
    radius?: number;
    interest?: string[];
    lookingFor?: string[];
    prompt1?: string;
    answer1?: string;
    prompt2?: string;
    answer2?: string;
    prompt3?: string;
    answer3?: string;
}

export function useFetchUserDetails(userId: number | null) {
    const [userDetails, setUserDetails] = useState<FullUserDetails | null>(null);
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
            setLoading(true);
            setError(null);
            try {
                // Fetch full profile from the correct endpoint
                const res = await fetch(`http://localhost:8085/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        // If profile not found, maybe fetch just user summary?
                        // But for a social platform, profile should exist.
                        throw new Error('Profile not found');
                    }
                    throw new Error(`Failed to load profile (${res.status})`);
                }

                const profileData = await res.json();

                // Map ProfileResponseDTO to our FullUserDetails interface
                setUserDetails({
                    id: profileData.id,
                    email: profileData.email,
                    nickname: profileData.nickname || '',
                    imageUrl: profileData.imageUrl || '/favicon.svg',
                    bio: profileData.bio || '',
                    age: profileData.age,
                    gender: profileData.gender,
                    location: profileData.location || '',
                    latitude: profileData.latitude,
                    longitude: profileData.longitude,
                    radius: profileData.radius || 50,
                    interest: profileData.interest || [],
                    lookingFor: profileData.lookingFor || [],
                    prompt1: profileData.prompt1,
                    answer1: profileData.answer1,
                    prompt2: profileData.prompt2,
                    answer2: profileData.answer2,
                    prompt3: profileData.prompt3,
                    answer3: profileData.answer3,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        };

        fetchAllUserDetails();
    }, [userId, token]);

    return { userDetails, loading, error };
}