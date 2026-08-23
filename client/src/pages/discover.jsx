import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus } from "lucide-react";
import dummyUsers from "../data/dummyDiscoverdata";

const discover = () => {
  const [search, setSearch] = useState("");

  // Only recommended users
  const recommendedUsers = dummyUsers.filter(
    (user) => user.recommended === true
  );

  // Search through all users
  const filteredUsers = dummyUsers.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query) ||
      user.work.toLowerCase().includes(query) ||
      user.workplace.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.hobbies.some((hobby) =>
        hobby.toLowerCase().includes(query)
      )
    );
  });

  // Show only 5 recommendations when there is no search
  const usersToDisplay =
    search.trim() === ""
      ? recommendedUsers.slice(0, 5)
      : filteredUsers;

  return (
    <div className="min-h-screen bg-[#E8F5F3] px-6 py-8">

      {/* Header */}
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#17383A]">
            Discover
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Find interesting people and connect with them.
          </p>
        </div>

        {/* Search */}
        <div
          className="
            flex
            items-center
            gap-3
            h-12
            px-4
            mb-7
            bg-white
            rounded-2xl
            border border-[#D9E8E5]
            shadow-sm
            focus-within:border-[#2E8B72]
            transition-all
          "
        >
          <Search
            size={19}
            className="text-gray-400 shrink-0"
          />

          <input
            type="text"
            placeholder="Search people, hobbies, work, bio..."
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

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#17383A]">
              {search.trim() === ""
                ? "People you may know"
                : "Search results"}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              {search.trim() === ""
                ? "Discover new people to follow"
                : `${usersToDisplay.length} people found`}
            </p>
          </div>
        </div>

        {/* User Cards */}
        {usersToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {usersToDisplay.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="
                  group
                  block
                  bg-white
                  rounded-[24px]
                  border border-[#D9E8E5]
                  p-5
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-lg
                  hover:border-[#2E8B72]
                  active:scale-[0.98]
                "
              >

                {/* Profile */}
                <div className="flex items-center gap-3">

                  <div className="relative shrink-0">

                    <img
                      src={user.dp}
                      alt={user.name}
                      className="
                        w-14
                        h-14
                        rounded-full
                        object-cover
                        ring-2
                        ring-[#E8F5F3]
                        transition-transform
                        duration-200
                        group-hover:scale-105
                      "
                    />

                  </div>

                  <div className="min-w-0">

                    <h3
                      className="
                        font-semibold
                        text-[#17383A]
                        truncate
                        transition-colors
                        duration-200
                        group-hover:text-[#2E8B72]
                      "
                    >
                      {user.name}
                    </h3>

                    <p className="text-xs text-gray-400 truncate">
                      {user.username}
                    </p>

                  </div>

                </div>

                {/* Bio */}
                <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {user.bio}
                </p>

                {/* Hobbies */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {user.hobbies.slice(0, 3).map((hobby) => (
                    <span
                      key={hobby}
                      className="
                        px-2.5
                        py-1
                        rounded-full
                        bg-[#E8F5F3]
                        text-[#285557]
                        text-[10px]
                        font-medium
                      "
                    >
                      {hobby}
                    </span>
                  ))}

                </div>

                {/* Work */}
                <div className="mt-4">

                  <p className="text-[11px] text-gray-400">
                    {user.role}
                  </p>

                  <p className="text-sm font-medium text-[#17383A]">
                    {user.workplace}
                  </p>

                </div>

                {/* Follow Button */}
                <div className="mt-5">

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-2.5
                      rounded-xl
                      bg-[#17383A]
                      text-white
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      hover:bg-[#285557]
                      active:scale-[0.98]
                      cursor-pointer
                    "
                  >
                    <UserPlus size={16} />
                    Follow
                  </button>

                </div>

              </Link>
            ))}

          </div>
        ) : (

          /* No Results */
          <div className="text-center py-16">

            <div
              className="
                w-14
                h-14
                mx-auto
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                text-[#17383A]
                border border-[#D9E8E5]
              "
            >
              <Search size={22} />
            </div>

            <h3 className="mt-4 font-semibold text-[#17383A]">
              No people found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try searching with another name, hobby, bio or workplace.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default discover;