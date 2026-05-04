import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { useFetchUserDetails, type FullUserDetails } from '../hooks/useFetchUserDetails';
import ViewProfile from '../components/profile/ViewProfile.tsx';
import EditProfile from '../components/profile/EditProfile.tsx';
import { useFetchUserPosts } from '../hooks/useFetchUserPosts';

function Profile({ isConnection }: { isConnection?: boolean }) {
    const [myProfile, setMyProfile] = useState<FullUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editView, setEditView] = useState<boolean>(false);
    const [needsRefresh, setNeedsRefresh] = useState<boolean>(true);
    const { token } = useAuth();
    const { userId: urlUserId } = useParams();

    // For viewing another user's profile
    const { userDetails: fetchedUserDetails, loading: isFetching, error: fetchError } =
        useFetchUserDetails(isConnection !== undefined && urlUserId ? Number(urlUserId) : null);

    const { posts: userPosts } = useFetchUserPosts(
        isConnection !== undefined && urlUserId ? Number(urlUserId) : (myProfile?.id ?? null)
    );

    const changeView = () => setEditView(current => !current);

    const handleRequestConnection = async () => {
        try {
            const response = await fetch(`http://localhost:8085/${urlUserId}/request`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to send connection request');
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveConnection = async () => {
        try {
            const response = await fetch(`http://localhost:8085/connections/${urlUserId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to remove connection');
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch own profile
    useEffect(() => {
        if (isConnection !== undefined || !needsRefresh) return;

        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:8085/me/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
                const data = await res.json();
                setMyProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setIsLoading(false);
                setNeedsRefresh(false);
            }
        };

        fetchProfile();
    }, [isConnection, needsRefresh, token]);

    const currentUserDetails = isConnection === undefined ? myProfile : fetchedUserDetails;

    let buttonHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
    let buttonText: string;
    let showAllDetails: boolean;

    switch (isConnection) {
        case false:
            buttonHandler = handleRequestConnection;
            buttonText = 'Connect';
            showAllDetails = false;
            break;
        case true:
            buttonHandler = handleRemoveConnection;
            buttonText = 'Remove';
            showAllDetails = false;
            break;
        default:
            buttonHandler = changeView;
            buttonText = 'Edit Profile';
            showAllDetails = true;
    }

    if (isConnection === undefined && isLoading) {
        return <ProfileSkeleton />;
    }
    if (isConnection !== undefined && isFetching) {
        return <ProfileSkeleton />;
    }
    if (fetchError) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-[#ff7351] text-xl mb-2">Failed to load profile</p>
                    <p className="text-[#adaaaa] text-sm">{fetchError}</p>
                </div>
            </div>
        );
    }
    if (!currentUserDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-[#adaaaa] text-xl">No profile found.</p>
            </div>
        );
    }

    return (
        <>
            {editView ? (
                <EditProfile
                    userDetails={currentUserDetails as FullUserDetails & { nickname: string; interest: string[]; bio: string; age: number | null; gender: string; lookingFor: string[]; location: string; latitude: number | null; longitude: number | null; radius: number; imageUrl: string; }}
                    viewChange={changeView}
                    needsRefresh={setNeedsRefresh}
                />
            ) : (
                <ViewProfile
                    user={currentUserDetails}
                    buttonHandler={buttonHandler}
                    buttonText={buttonText}
                    showAllDetails={showAllDetails}
                    userID={urlUserId}
                    posts={userPosts}
                />
            )}
        </>
    );
}

function ProfileSkeleton() {
    return (
        <div className="p-4 animate-pulse">
            <div className="max-w-4xl mx-auto bg-[#1C1B1B] border border-[#313030] rounded-xl p-8">
                <div className="flex items-start gap-8">
                    <div className="h-40 w-40 bg-[#313030] rounded-xl" />
                    <div className="flex-1 space-y-4 mt-2">
                        <div className="h-8 w-48 bg-[#313030] rounded" />
                        <div className="h-4 w-32 bg-[#313030] rounded" />
                        <div className="h-10 w-24 bg-[#313030] rounded-lg mt-4" />
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    <div className="h-4 w-full bg-[#313030] rounded" />
                    <div className="h-4 w-3/4 bg-[#313030] rounded" />
                    <div className="h-4 w-1/2 bg-[#313030] rounded" />
                </div>
            </div>
        </div>
    );
}

export default Profile;
