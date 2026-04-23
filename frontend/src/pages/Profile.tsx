import ViewProfile from "../components/profile/ViewProfile.tsx";
import EditProfile from "../components/profile/EditProfile.tsx";
import {useState, useEffect} from "react";

function Profile() {
    const [userDetails, setUserDetails] = useState(null)
    const [editView, setEditView] = useState<boolean>(false);
    const changeView = (e:React.MouseEvent<HTMLButtonElement>) => {
        setEditView(!editView);
    }

    useEffect(() => {
        async function fetchProfile() {
            try {
                const userProfileResponse = await fetch('http://localhost:8085/me/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const userProfileDetails = await userProfileResponse.json();
                setUserDetails(userProfileDetails);
                console.log(userDetails);
            }
            catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        }
        fetchProfile();
        }, [editView]);

    if (!userDetails) return <>loading...</>

    return (
        <>
            {editView ? <EditProfile userDetails={userDetails} viewChange={changeView}/> : <ViewProfile user={userDetails} editButton={changeView}/>}
        </>
    )
}

export default Profile;