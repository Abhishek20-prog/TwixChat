import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import dummyRecentMessages from "../data/dummyrecentmessage";

const RecentMessage = () => {
  const [recentMessages, setRecentMessages] = useState([]);

  const fetchRecentMessages = () => {
    setRecentMessages(dummyRecentMessages);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

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
      {/* Heading */}
      <h2 className="text-[15px] font-semibold text-[#17383A]">
        Recent Messages
      </h2>

      {/* Messages */}
      <div className="mt-4 space-y-1">
        {recentMessages.map((message) => (
          <Link
            to={`/message/${message.user.id}`}
            key={message.id}
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
                src={message.user.dp}
                alt={message.user.name}
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

              {/* Online Indicator */}
              {message.isOnline && (
                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-3
                    h-3
                    rounded-full
                    bg-green-500
                    border-2
                    border-white
                  "
                />
              )}
            </div>

            {/* Message Info */}
            <div className="min-w-0 flex-1">

              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#17383A] truncate">
                  {message.user.name}
                </h3>

                <span className="text-[10px] text-gray-400 shrink-0">
                  {moment(message.createdAt).fromNow()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p
                  className={`
                    text-xs truncate
                    ${
                      message.isTyping
                        ? "text-[#2E8B72] font-medium"
                        : message.unreadCount > 0
                        ? "text-[#17383A] font-medium"
                        : "text-gray-500"
                    }
                  `}
                >
                  {message.isTyping
                    ? "Typing..."
                    : message.lastMessage.type === "image"
                    ? "📷 Photo"
                    : message.lastMessage.type === "video"
                    ? "🎥 Video"
                    : message.lastMessage.text}
                </p>

                {/* Unread Count */}
                {message.unreadCount > 0 && (
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
                    {message.unreadCount}
                  </span>
                )}
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessage;