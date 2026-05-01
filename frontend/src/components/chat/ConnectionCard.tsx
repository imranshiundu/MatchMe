import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth";
import Icon from "../Icon";

function ConnectionCard({userId, isOnline}) {

    const [userDetails, setUserDetails] = useState({
        nickname: "",
        imageUrl: null
    });

    const { token } = useAuth();
    useEffect(() => {
        async function fetchUserDetails (userId) {
            try {
                const requestUser = await fetch(`http://localhost:8085/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userResponse = await requestUser.json();
                setUserDetails(userResponse);
            }
            catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        }
        fetchUserDetails(userId);
    }, []);

    return (
        <div className={'bg-[#1C1B1B] border-2 border-[#313030] rounded-lg flex max-w-150 mt-3'}>
            <img
                className={`h-13 w-13 rounded-lg inline-block ${isOnline !== null ? (isOnline ? "border-3 border-[#eaffb8]" : "border-3 border-[#ff7351]") : null}`}
                src={userDetails.imageUrl}
                alt="Profile"
            />
            <div className={'flex flex-col flex-1 ml-2 mr-2 min-w-0'}>
                <p className={'text-xl'}>{userDetails.nickname}</p>
                <p className={'text-[#adaaaa] text-sm truncate'}>last message / X new message(s)</p>
            </div>
            <Link
                to={`./user/${userId}`}
                className={'cursor-pointer content-center rounded-lg my-2 px-3 py-2 border-b-2 border-[#313030] bg-[#403d39] fill-[#C0FF00] hover:border-b-0 hover:border-t-2 hover:border-[#1C1B1B] hover:bg-[#474646] hover:fill-[#608200]'}>
                <Icon name={'view-profile-icon'}/>
            </Link>
            <Link
                to={`./chat/${userId}`}
                className={'cursor-pointer content-center rounded-lg m-2 px-3 py-2 border-b-2 border-[#313030] bg-[#403d39] fill-[#C0FF00] hover:border-b-0 hover:border-t-2 hover:border-[#1C1B1B] hover:bg-[#474646] hover:fill-[#608200]'}>
                <Icon name={'message-icon'}/>
            </Link>
        </div>
    )
}

export default ConnectionCard;

// TODO User online status
// <div className={`h-12 w-12 bg-[#CCC5B9] border-3 ${isOnline ? "border-[#eaffb8]" : "border-[#ff7351]"} rounded-lg inline-block`}/>

// TODO Show last message
// <p className={'text-[#adaaaa] text-xs truncate'}>{recentMessage}</p>