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
        <div className={'bg-[#313030] rounded-lg flex max-w-150 mt-3'}>
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
                className={'cursor-pointer border-b-3 border-[#CACD40] bg-[#E7EA5A] text-[#121212] my-2 px-3 py-2 rounded-sm hover:bg-[#F5F867] hover:text-[#1c1b1b] content-center transition-all delay-100'}>
                <Icon name={'view-profile-icon'}/>
            </Link>
            <Link
                to={`./chat/${userId}`}
                className={'cursor-pointer content-center bg-[#C0FF00] border-b-3 border-[#A2D800] text-[#121212] m-2 px-3 py-2 rounded-sm hover:bg-[#D8FF80] hover:text-[#1c1b1b] transition-all delay-100'}>
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