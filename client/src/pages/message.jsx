
import { useEffect, useState } from "react";
import {
  MessageCircle,
  MoreHorizontal,
  Search,
  X,
  MessagesSquare,
  ArrowUpRight,
  Paperclip,
  Image as ImageIcon,
  Video,
  FileText,
  Sparkles,
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

  const { recentChats = [], loading } = useSelector(
    (state) => state.message,
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
      (item) => item.user?._id === userId,
    );

    if (chat?.user) {
      dispatch(setSelectedUser(chat.user));
    }
  }, [userId, recentChats, dispatch]);

  const filteredMessages = recentChats.filter((chat) => {
    const name = chat.user?.full_name || "";
    const username = chat.user?.username || "";
    const query = search.trim().toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      username.toLowerCase().includes(query)
    );
  });

  const handleOpenChat = (user) => {
    dispatch(setSelectedUser(user));
    navigate(`/message/${user._id}`);
  };

  const getMessagePreview = (message) => {
    if (!message) return "Start a conversation";

    switch (message.messageType) {
      case "image":
        return (
          <span className="flex items-center gap-1.5">
            <ImageIcon size={14} />
            Photo
          </span>
        );

      case "video":
        return (
          <span className="flex items-center gap-1.5">
            <Video size={14} />
            Video
          </span>
        );

      case "file":
        return (
          <span className="flex items-center gap-1.5">
            <Paperclip size={14} />
            File
          </span>
        );

      default:
        return message.content || "Sent a message";
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5F3] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17383A] text-white shadow-sm">
                <MessagesSquare size={19} />
              </span>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#527777]">
                TwixChat / Inbox
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#17383A] sm:text-4xl">
              Messages<span className="text-[#F29B62]">.</span>
            </h1>

            <p className="mt-2 text-sm text-[#708A89] sm:text-base">
              Your conversations, all in one place.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5F3] text-[#285557]">
              <MessageCircle size={20} />
            </div>

            <div>
              <p className="text-xl font-bold leading-tight text-[#17383A]">
                {recentChats.length}
              </p>
              <p className="mt-1 text-[11px] font-medium text-[#7B9291]">
                Conversations
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-[#DCE8E4] bg-white p-2 shadow-[0_4px_18px_rgba(23,56,58,0.04)] transition-all duration-200 focus-within:border-[#7BA9A3] focus-within:shadow-[0_0_0_3px_rgba(123,169,163,0.12)]">
          <div className="flex h-11 items-center gap-3 px-3">
            <Search
              size={19}
              className="shrink-0 text-[#8CA4A2]"
            />

            <input
              type="text"
              placeholder="Search by name or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#17383A] outline-none placeholder:text-[#9AABAA]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#829694] transition hover:bg-[#E8F5F3] hover:text-[#17383A]"
              >
                <X size={16} />
              </button>
            )}

            <div className="hidden items-center gap-1 rounded-lg bg-[#F3F8F6] px-2 py-1 text-[10px] text-[#829694] sm:flex">
              <Search size={11} />
              Search
            </div>
          </div>
        </div>

        {/* Section heading */}
        <div className="mb-4 flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-[#23494A]">
              {search ? "Search results" : "Recent conversations"}
            </h2>
            <p className="mt-1 text-xs text-[#819694]">
              {search
                ? `${filteredMessages.length} matching conversation${filteredMessages.length === 1 ? "" : "s"}`
                : "Pick up where you left off"}
            </p>
          </div>

          {!search && recentChats.length > 0 && (
            <span className="rounded-full border border-[#D5E6E0] bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-[#62817D]">
              {recentChats.length} total
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4 rounded-[22px] border border-[#DDE9E5] bg-white/80 p-4"
              >
                <div className="h-14 w-14 shrink-0 rounded-full bg-[#E2EEEA]" />

                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-32 rounded-full bg-[#E2EEEA]" />
                  <div className="h-3 w-24 rounded-full bg-[#EDF3F1]" />
                  <div className="h-3 w-44 max-w-full rounded-full bg-[#EDF3F1]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversations */}
        {!loading && filteredMessages.length > 0 && (
          <div className="space-y-3">
            {filteredMessages.map((chat) => {
              const user = chat.user;

              if (!user?._id) return null;

              const lastMessage = chat.lastMessage;
              const unread = Number(chat.unread) || 0;
              const isSelected = userId === user._id;

              return (
                <div
                  key={user._id}
                  className={`group relative overflow-hidden rounded-[22px] border bg-white transition-all duration-200 ${
                    isSelected
                      ? "border-[#86B5AB] shadow-[0_5px_20px_rgba(23,56,58,0.08)]"
                      : "border-[#DFE9E5] shadow-[0_3px_12px_rgba(23,56,58,0.035)] hover:-translate-y-0.5 hover:border-[#B7D4CB] hover:shadow-[0_8px_24px_rgba(23,56,58,0.08)]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-[#F29B62]" />
                  )}

                  <Link
                    to={`/message/${user._id}`}
                    onClick={() => dispatch(setSelectedUser(user))}
                    className="flex min-w-0 items-center gap-3 p-4 sm:gap-4 sm:p-5"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="rounded-full border-2 border-[#DCECE6] p-[3px] transition-colors duration-200 group-hover:border-[#F3C09B]">
                        <img
                          src={user.profile_picture}
                          alt={user.full_name || user.username || "User"}
                          className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
                        />
                      </div>

                      {unread > 0 && (
                        <span className="absolute -right-0.5 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#F29B62]" />
                      )}
                    </div>

                    {/* Conversation details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-[#17383A] transition-colors group-hover:text-[#356765] sm:text-[15px]">
                            {user.full_name || user.username}
                          </h3>

                          <p className="mt-1 truncate text-xs text-[#8A9F9D]">
                            @{user.username || "user"}
                          </p>
                        </div>

                        <span className="shrink-0 pt-0.5 text-[10px] font-medium text-[#8DA09E] sm:text-[11px]">
                          {lastMessage?.createdAt
                            ? moment(lastMessage.createdAt).fromNow()
                            : ""}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div
                          className={`min-w-0 truncate text-xs ${
                            unread > 0
                              ? "font-semibold text-[#285557]"
                              : "text-[#819391]"
                          }`}
                        >
                          {getMessagePreview(lastMessage)}
                        </div>

                        {unread > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#17383A] px-1.5 text-[10px] font-bold text-white shadow-sm">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Desktop quick actions */}
                    <div className="hidden shrink-0 items-center gap-1 sm:flex">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F7F4] text-[#5C817C] transition-all duration-200 group-hover:bg-[#E3F1EB] group-hover:text-[#17383A]">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </Link>

                  {/* More options */}
                <button
  type="button"
  aria-label={`Open chat with ${user.full_name || user.username}`}
  onClick={() => handleOpenChat(user)}
  className="
    absolute right-4 top-1/2 -translate-y-1/2
    flex h-10 w-10 items-center justify-center
    rounded-xl
    bg-[#E8F5F3] text-[#285557]
    opacity-100
    transition-all duration-200
    hover:bg-[#17383A] hover:text-white
    active:scale-95
    sm:right-5
  "
>
  <MessageCircle size={19} strokeWidth={1.8} />
</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredMessages.length === 0 && (
          <div className="rounded-[26px] border border-[#DCE8E4] bg-white/75 px-5 py-12 text-center shadow-[0_4px_18px_rgba(23,56,58,0.035)] sm:py-16">
            <div className="relative mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[25px] bg-[#E8F5F3] text-[#285557]">
              {search ? (
                <Search size={29} strokeWidth={1.7} />
              ) : (
                <MessagesSquare size={31} strokeWidth={1.7} />
              )}

              <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-white bg-[#F7C59E] text-[#754B2E]">
                {search ? (
                  <X size={13} />
                ) : (
                  <Sparkles size={13} />
                )}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#17383A]">
              {search
                ? "No conversations found"
                : "Your inbox is waiting"}
            </h3>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#819391]">
              {search
                ? "We couldn't find anyone matching that name. Try another search."
                : "Your conversations will appear here when you start chatting with someone."}
            </p>

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17383A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285557] active:scale-[0.98]"
              >
                <X size={14} />
                Clear search
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/discover")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17383A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#285557] active:scale-[0.98]"
              >
                <MessageCircle size={15} />
                Find people
                <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && recentChats.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2 pb-4 text-[11px] text-[#91A6A2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F29B62]" />
            <span>Good conversations start here.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

