import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx'
import { useFetchUserDetails } from '../hooks/useFetchUserDetails';
import ViewProfile from '../components/profile/ViewProfile.tsx';
import EditProfile from "../components/profile/EditProfile.tsx";

function Profile({ isConnection }: { isConnection?: boolean }) {
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editView, setEditView] = useState<boolean>(false);
    const [needsRefresh, setNeedsRefresh] = useState<boolean>(true);
    const { token } = useAuth();
    const { userId: urlUserId } = useParams();
    const { userDetails: fetchedUserDetails, loading: isFetching, error: fetchError } = useFetchUserDetails(isConnection !== undefined && urlUserId ? Number(urlUserId) : null);

    const changeView = (e: React.MouseEvent<HTMLButtonElement>) => {
        setEditView(!editView);
    };

    const handleRequestConnection = async () => {
        try {
            const response = await fetch(`http://localhost:8085/${urlUserId}/request`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to send connection request");
            console.log("Connection sent");
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveConnection = async () => {
        try {
            const response = await fetch(`http://localhost:8085/connections/${urlUserId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to remove connection");
            console.log("Connection removed");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isConnection === undefined && needsRefresh) {
            async function fetchProfile() {
                try {
                    const userProfileResponse = await fetch("http://localhost:8085/me/profile", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const userProfileDetails = await userProfileResponse.json();
                    setUserDetails(userProfileDetails);
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchProfile();
            setNeedsRefresh(false);
        } else {
            setIsLoading(false);
        }
    }, [isConnection, needsRefresh, token]);

    const currentUserDetails = isConnection === undefined ? userDetails : fetchedUserDetails;

    let buttonHandler, buttonText, showAllDetails;
    switch (isConnection) {
        case false:
            buttonHandler = handleRequestConnection;
            buttonText = "Connect";
            showAllDetails = false;
            break;
        case true:
            buttonHandler = handleRemoveConnection;
            buttonText = "Remove";
            showAllDetails = false;
            break;
        default:
            buttonHandler = changeView;
            buttonText = "Edit Profile";
            showAllDetails = true;
    }

    if (isConnection === undefined && isLoading) return <p className={'text-3xl h-full w-full content-center text-center'}>loading...</p>;
    if (isConnection !== undefined && isFetching) return <p className={'text-3xl h-full w-full content-center text-center'}>loading...</p>;
    if (fetchError) return <p className={'text-[#ff7351] text-3xl h-full w-full content-center text-center'}>{fetchError}</p>;
    if (!currentUserDetails) return <p className={'text-3xl h-full w-full content-center text-center'}>No user details found.</p>;

    return (
        <>
            {editView ? (
                <EditProfile userDetails={currentUserDetails} viewChange={changeView} needsRefresh={setNeedsRefresh} />
            ) : (
                <ViewProfile
                    user={currentUserDetails}
                    buttonHandler={buttonHandler}
                    buttonText={buttonText}
                    showAllDetails={showAllDetails}
                />
            )}
        </>
    );
}

export default Profile;