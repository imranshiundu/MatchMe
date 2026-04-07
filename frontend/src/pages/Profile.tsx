import ViewProfile from "../components/profile/ViewProfile.tsx";
import EditProfile from "../components/profile/EditProfile.tsx";
import {useState} from "react";

function Profile() {
    // Placeholder for dynamic data
    const user = {
        name: "John Programming",
        age: "30",
        gender: "Male",
        location: "Earth",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        interests: ["Python", "Java", "TypeScript", "Vibe Coding", "Backend"],
    };

    const [editView, setEditView] = useState<boolean>(false);
    const changeView = (e:React.MouseEvent<HTMLButtonElement>) => {
        setEditView(!editView);
    }


    return (
        <>
            {editView ? <EditProfile viewChange={changeView}/> : <ViewProfile user={user} editButton={changeView}/>}
        </>
    )
}

export default Profile;