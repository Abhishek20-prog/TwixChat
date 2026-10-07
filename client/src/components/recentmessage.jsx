import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";

const RecentMessage = () => {
  const { recentChats } = useSelector(
    (state) => state.message
  );

  return (
    <div
      className="
        rounded-[28px]
        bg-white/70
        border
        border-[#E8E2D8]
        p-5
        shadow-sm
      "
    >
      <h2 className="text-[15px] font-semibold text-[#17383A]">
        Recent Messages
      </h2>

      <div className="mt-4 space-y-1">
        {recentChats.map((chat) => {
          const user = chat.user;
          const lastMessage = chat.lastMessage;

          return (
            <Link
              to={`/message/${user._id}`}
              key={user._id}
              className="
                flex
                items-center
                gap-3
                p-2
                rounded-xl
                transition-all
                duration-200
                hover:bg-[#F3F7F6]
              "
            >
              {/* Profile Picture */}
              <div className="relative shrink-0">
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="
                    w-10
                    h-10
                    rounded-full
                    object-cover
                    transition-transform
                    duration-200
                    hover:scale-105
                  "
                />
              </div>

              {/* Message Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#17383A] truncate">
                    {user.full_name}
                  </h3>

                  <span className="text-[10px] text-gray-400 shrink-0">
                    {lastMessage?.createdAt
                      ? moment(lastMessage.createdAt).fromNow()
                      : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`
                      text-xs truncate
                      ${
                        chat.unread > 0
                          ? "text-[#17383A] font-medium"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {lastMessage?.messageType === "image"
                      ? "📷 Photo"
                      : lastMessage?.messageType === "video"
                      ? "🎥 Video"
                      : lastMessage?.messageType === "file"
                      ? "📎 File"
                      : lastMessage?.content || ""}
                  </p>

                  {/* Unread Count */}
                  {chat.unread > 0 && (
                    <span
                      className="
                        min-w-5
                        h-5
                        px-1
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-[#17383A]
                        text-white
                        text-[10px]
                        font-semibold
                      "
                    >
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {recentChats.length === 0 && (
          <p className="text-xs text-gray-400 py-4 text-center">
            No recent messages
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentMessage;