// external
import { useParams } from 'react-router-dom';

// components
import ChatView from '../components/chat/ChatView.tsx'
import { useFetchNameAndPicture } from '../hooks/useFetchNameAndPicture.tsx'

function Chat() {
    const { userId } = useParams<{ userId : string }>();
    const { userData, loading, error } = useFetchNameAndPicture(userId);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!userData) {
        return <div>No user data found</div>;
    }
    return (
        <ChatView nickname={userData.nickname} imageUrl={userData.imageUrl} isOnline={true}/>
    )
}

export default Chat;