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
    const isNew = !latestMessage?.read && latestMessage?.senderId === Number(userId);

    return (
        <div className="flex items-center gap-4 p-4 sm:p-6 hover:bg-[#252422] transition-all group relative">
            {/* New Message Indicator Dot */}
            {isNew && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#C0FF00] rounded-r-full shadow-[0_0_15px_rgba(192,255,0,0.5)]" />
            )}

            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <img
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border-2 border-[#313030] group-hover:border-[#C0FF00] transition-colors shadow-lg"
                    src={imageUrl || '/favicon.svg'}
                    alt={nickname}
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#C0FF00] transition-colors truncate">
                        {nickname}
                    </h3>
                    {latestMessage && (
                        <span className="text-[10px] sm:text-xs text-[#5a6a6a] font-mono whitespace-nowrap">
                            {new Date(latestMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                
                <p className={`text-sm truncate ${isNew ? 'text-[#C0FF00] font-bold' : 'text-[#adaaaa]'}`}>
                    {isNew ? (
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C0FF00] animate-pulse" />
                            New message: {latestMessage?.content}
                        </span>
                    ) : (
                        latestMessage?.content ?? 'No messages yet'
                    )}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <Link
                    to={`./user/${userId}`}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#313030] fill-[#adaaaa] hover:bg-[#403d39] hover:fill-[#C0FF00] transition-all"
                    title="View Profile"
                >
                    <Icon name="view-profile-icon" size={20} />
                </Link>

                <Link
                    to={`./chat/${userId}`}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#313030] fill-[#adaaaa] hover:bg-[#403d39] hover:fill-[#C0FF00] transition-all relative"
                    title="Open Chat"
                >
                    <Icon name="message-icon" size={20} />
                    {isNew && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C0FF00] rounded-full border-2 border-[#1C1B1B]" />
                    )}
                </Link>
            </div>
        </div>
    );
}

export default ConnectionCard;