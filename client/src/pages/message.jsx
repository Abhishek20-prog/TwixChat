import React, { useEffect, useState } from "react";
import { MessageCircle, MoreHorizontal, Search } from "lucide-react";
import moment from "moment";

import dummyMessages from "../data/dummymessage";

const message = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMessages(dummyMessages);
  }, []);

  const filteredMessages = messages.filter(
    (message) =>
      message.user.name.toLowerCase().includes(search.toLowerCase()) ||
      message.user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FCFB] px-6 py-8">

      {/* Page Header */}
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
            className="
              w-10 h-10
              rounded-full
              bg-[#17383A]
              text-white
              flex items-center justify-center
              transition-all duration-200
              hover:scale-105
              hover:bg-[#285557]
              active:scale-95
            "
          >
            <MessageCircle size={19} />
          </button>

        </div>

        {/* Search */}
        <div
          className="
            flex items-center gap-3
            px-4
            h-11
            mb-5
            rounded-2xl
            bg-white
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
              w-full
              bg-transparent
              outline-none
              text-sm
              text-[#17383A]
              placeholder:text-gray-400
            "
          />
        </div>

        {/* Message List */}
        <div className="space-y-3">

          {filteredMessages.map((message) => (

            <div
              key={message.id}
              className="
                group
                relative
                flex
                items-center
                gap-4
                p-4
                rounded-[24px]
                bg-white/80
                border border-[#E8E2D8]
                shadow-sm
                transition-all duration-200
                hover:-translate-y-[2px]
                hover:shadow-md
                hover:border-[#C9D2D0]
              "
            >

              {/* Profile Picture */}
              <div className="relative shrink-0 hover:cursor-pointer">

                <img
                  src={message.user.dp}
                  alt={message.user.name}
                  className="
                    w-14 h-14
                    rounded-full
                    object-cover
                    ring-2 ring-white
                    transition-transform duration-200
                    group-hover:scale-105
                  "
                />

                {/* Online */}
                {message.status === "Online" && (
                  <span
                    className="
                      absolute
                      right-0
                      bottom-0
                      w-4
                      h-4
                      rounded-full
                      bg-[#39B77A]
                      border-[3px]
                      border-white
                    "
                  />
                )}

              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">

                {/* Name + Time */}
                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2 min-w-0">

                    <h2
                      className="
                        text-sm
                        font-semibold
                        text-[#17383A]
                        truncate
                        transition-colors
                        group-hover:text-[#285557]
                        hover:cursor-pointer
                      "
                    >
                      {message.user.name}
                    </h2>

                    {message.status === "Online" && (
                      <span
                        className="
                          text-[9px]
                          font-medium
                          text-[#39B77A]
                          bg-[#EAF8F1]
                          px-2
                          py-0.5
                          rounded-full
                        "
                      >
                        Online
                      </span>
                    )}

                  </div>

                  <span className="text-[10px] text-gray-400 shrink-0">
                    {moment(message.createdAt).fromNow()}
                  </span>

                </div>

                {/* Username */}
                <p className="text-[11px] text-gray-400 mt-0.5 hover:cursor-pointer">
                  {message.user.username}
                </p>

                {/* Last Message */}
                <div className="flex items-center justify-between gap-3 mt-2 hover:cursor-pointer">

                  <p
                    className={`
                      text-xs
                      truncate
                      ${
                        message.unread > 0
                          ? "font-semibold text-[#17383A]"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {message.message}
                  </p>

                  {/* Unread */}
                  {message.unread > 0 && (
                    <span
                      className="
                        shrink-0
                        min-w-5
                        h-5
                        px-1.5
                        rounded-full
                        bg-[#17383A]
                        text-white
                        text-[10px]
                        font-semibold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {message.unread}
                    </span>
                  )}

                </div>

              </div>

              {/* Actions */}
              <div
                className="
                  flex
                  items-center
                  gap-1
                  opacity-0
                  translate-x-2
                  group-hover:opacity-100
                  group-hover:translate-x-0
                  transition-all duration-200
                  hover:cursor-pointer
                "
              >

                <button
                  className="
                    w-8 h-8
                    rounded-full
                    flex items-center justify-center
                    text-gray-400
                    hover:text-[#17383A]
                    hover:bg-[#F3F7F6]
                    transition-all
                    hover:cursor-pointer
                  "
                >
                  <MessageCircle size={16} />
                </button>

                <button
                  className="
                    w-8 h-8
                    rounded-full
                    flex items-center justify-center
                    text-gray-400
                    hover:text-[#17383A]
                    hover:bg-[#F3F7F6]
                    transition-all
                    hover:cursor-pointer
                  "
                >
                  <MoreHorizontal size={17} />
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* No Results */}
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">

            <div
              className="
                w-12 h-12
                mx-auto
                rounded-full
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

            <p className="text-xs text-gray-400 mt-1">
              Try searching for another person.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default message;