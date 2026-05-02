import { Link } from 'react-router-dom';
import Icon from '../Icon';

type ChatMsgDTO = {
    id: number;
    chatId: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    read: boolean;
};

type Props = {
    userId: number;
    nickname: string;
    imageUrl: string;
    latestMessage: ChatMsgDTO | null;
};

function ConnectionCard({ userId, nickname, imageUrl, latestMessage }: Props) {
    return (
        <div className="bg-[#1C1B1B] border-2 border-[#313030] rounded-lg flex max-w-150 mt-3">
            <img
                className="h-13 w-13 rounded-lg inline-block"
                src={imageUrl}
                alt="Profile"
            />

            <div className="flex flex-col flex-1 ml-2 mr-2 min-w-0">
                <p className="text-xl">{nickname}</p>
                <p className="text-[#adaaaa] text-sm truncate">
                    {!latestMessage?.read && latestMessage?.senderId == Number(userId)
                        ? <span className="text-[#ff3b30]">New message(s)</span>
                        : latestMessage?.content ?? 'No messages yet'}
                </p>
            </div>

            <Link
                to={`./user/${userId}`}
                className="cursor-pointer content-center rounded-lg my-2 px-3 py-2 border-b-2 border-[#313030] bg-[#403d39] fill-[#C0FF00] hover:border-b-0 hover:border-t-2 hover:border-[#1C1B1B] hover:bg-[#474646] hover:fill-[#608200]"
            >
                <Icon name="view-profile-icon" />
            </Link>

            <Link
                to={`./chat/${userId}`}
                className="cursor-pointer content-center rounded-lg m-2 px-3 py-2 border-b-2 border-[#313030] bg-[#403d39] fill-[#C0FF00] hover:border-b-0 hover:border-t-2 hover:border-[#1C1B1B] hover:bg-[#474646] hover:fill-[#608200]"
            >
                <Icon name="message-icon" />
            </Link>
        </div>
    );
}

export default ConnectionCard;