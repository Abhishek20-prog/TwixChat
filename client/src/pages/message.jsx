import { useEffect, useState } from "react";
import {
    MessageCircle,
    MoreHorizontal,
    Search,
} from "lucide-react";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import {
    fetchRecentMessages,
    setSelectedUser,
} from "../features/messages/messageslice";

const Messages = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const { userId } = useParams();

    const { recentChats, loading } = useSelector(
        (state) => state.message
    );

    const [search, setSearch] = useState("");

    useEffect(() => {
        const loadMessages = async () => {
            const token = await getToken();

            if (token) {
                dispatch(fetchRecentMessages(token));
            }
        };

        loadMessages();
    }, [dispatch, getToken]);

    useEffect(() => {
        if (!userId || !recentChats.length) return;

        const chat = recentChats.find(
            (chat) => chat.user?._id === userId
        );

        if (chat?.user) {
            dispatch(setSelectedUser(chat.user));
        }
    }, [userId, recentChats, dispatch]);

    const filteredMessages = recentChats.filter((chat) => {
        const name = chat.user?.full_name || "";
        const username = chat.user?.username || "";

        return (
            name.toLowerCase().includes(search.toLowerCase()) ||
            username.toLowerCase().includes(search.toLowerCase())
        );
    });

    const handleOpenChat = (user) => {
        dispatch(setSelectedUser(user));
        navigate(`/message/${user._id}`);
    };

    return (
        <div className="min-h-screen bg-[#E8F5F3] px-6 py-8">
            <div className="max-w-3xl mx-auto">

                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#17383A]">
                            Messages
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Stay connected with your people.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/messages/new")}
                        className="
                            w-10 h-10 rounded-full
                            bg-[#17383A] text-white
                            flex items-center justify-center
                            cursor-pointer
                            transition-all duration-200
                            hover:scale-105
                            hover:bg-[#285557]
                            active:scale-95
                        "
                    >
                        <MessageCircle size={19} />
                    </button>
                </div>

                <div
                    className="
                        flex items-center gap-3
                        px-4 h-11 mb-5
                        rounded-2xl bg-white
                        border border-[#E8E2D8]
                        shadow-sm
                        focus-within:border-[#17383A]
                        transition-all duration-200
                    "
                >
                    <Search
                        size={18}
                        className="text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            w-full bg-transparent outline-none
                            text-sm text-[#17383A]
                            placeholder:text-gray-400
                        "
                    />
                </div>

                {loading && (
                    <div className="text-center py-10 text-sm text-gray-500">
                        Loading conversations...
                    </div>
                )}

                {!loading && (
                    <div className="space-y-3">
                        {filteredMessages.map((chat) => {
                            const user = chat.user;
                            const lastMessage = chat.lastMessage;

                            return (
                                <Link
                                    to={`/message/${user._id}`}
                                    key={user._id}
                                    onClick={() =>
                                        dispatch(setSelectedUser(user))
                                    }
                                    className="
                                        group relative
                                        flex items-center gap-4
                                        p-4 rounded-[24px]
                                        bg-white/80
                                        border border-[#E8E2D8]
                                        shadow-sm
                                        transition-all duration-200
                                        hover:-translate-y-[2px]
                                        hover:shadow-md
                                        hover:border-[#C9D2D0]
                                        cursor-pointer
                                    "
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={user.profile_picture}
                                            alt={user.full_name}
                                            className="
                                                w-14 h-14 rounded-full
                                                object-cover ring-2 ring-white
                                                transition-transform duration-200
                                                group-hover:scale-105
                                            "
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <h2
                                                className="
                                                    text-sm font-semibold
                                                    text-[#17383A] truncate
                                                    transition-colors duration-200
                                                    group-hover:text-[#285557]
                                                "
                                            >
                                                {user.full_name}
                                            </h2>

                                            <span className="text-[10px] text-gray-400 shrink-0">
                                                {lastMessage?.createdAt
                                                    ? moment(
                                                        lastMessage.createdAt
                                                    ).fromNow()
                                                    : ""}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                            {user.username}
                                        </p>

                                        <div className="flex items-center justify-between gap-3 mt-2">
                                            <p
                                                className={`
                                                    text-xs truncate
                                                    ${
                                                        chat.unread > 0
                                                            ? "font-semibold text-[#17383A]"
                                                            : "text-gray-500"
                                                    }
                                                `}
                                            >
                                                {lastMessage?.messageType ===
                                                "image"
                                                    ? "📷 Photo"
                                                    : lastMessage?.messageType ===
                                                      "video"
                                                    ? "🎥 Video"
                                                    : lastMessage?.messageType ===
                                                      "file"
                                                    ? "📎 File"
                                                    : lastMessage?.content || ""}
                                            </p>

                                            {chat.unread > 0 && (
                                                <span
                                                    className="
                                                        shrink-0 min-w-5 h-5 px-1.5
                                                        rounded-full
                                                        bg-[#17383A]
                                                        text-white
                                                        text-[10px]
                                                        font-semibold
                                                        flex items-center justify-center
                                                    "
                                                >
                                                    {chat.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="
                                            flex items-center gap-1
                                            opacity-0 translate-x-2
                                            group-hover:opacity-100
                                            group-hover:translate-x-0
                                            transition-all duration-200
                                        "
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleOpenChat(user);
                                            }}
                                            className="
                                                w-8 h-8 rounded-full
                                                flex items-center justify-center
                                                text-gray-400
                                                hover:text-[#17383A]
                                                hover:bg-[#F3F7F6]
                                                transition-all duration-200
                                                hover:scale-110
                                                active:scale-90
                                                cursor-pointer
                                            "
                                        >
                                            <MessageCircle size={16} />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                console.log(
                                                    "More options:",
                                                    user.full_name
                                                );
                                            }}
                                            className="
                                                w-8 h-8 rounded-full
                                                flex items-center justify-center
                                                text-gray-400
                                                hover:text-[#17383A]
                                                hover:bg-[#F3F7F6]
                                                transition-all duration-200
                                                hover:scale-110
                                                active:scale-90
                                                cursor-pointer
                                            "
                                        >
                                            <MoreHorizontal size={17} />
                                        </button>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredMessages.length === 0 && (
                    <div className="text-center py-12">
                        <div
                            className="
                                w-12 h-12 mx-auto rounded-full
                                bg-[#EAF3F1]
                                flex items-center justify-center
                                text-[#17383A]
                            "
                        >
                            <Search size={20} />
                        </div>

                        <p className="mt-3 text-sm font-medium text-[#17383A]">
                            No conversations found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Try searching for another person.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;