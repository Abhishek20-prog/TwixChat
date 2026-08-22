import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Clock3,
  UserRoundCheck,
  MessageCircle,
  UserCheck,
  UserX,
} from "lucide-react";

import dummyConnections from "../data/dummyconnection";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
  const [activeCategory, setActiveCategory] = useState("follower");

  useEffect(() => {
    setConnections(dummyConnections);
  }, []);

  const followersCount = connections.filter(
    (connection) => connection.type === "follower"
  ).length;

  const followingCount = connections.filter(
    (connection) => connection.type === "following"
  ).length;

  const pendingCount = connections.filter(
    (connection) => connection.type === "pending"
  ).length;

  const connectedCount = connections.filter(
    (connection) => connection.type === "connected"
  ).length;

  const categories = [
    {
      id: "follower",
      title: "Followers",
      count: followersCount,
      icon: Users,

      // Teal
      bg: "bg-[#E4F4F1]",
      iconBg: "bg-[#D2ECE7]",
      iconColor: "text-[#28766F]",
      activeBg: "bg-[#D8EFEB]",
      activeBorder: "border-[#4C9B91]",
    },

    {
      id: "following",
      title: "Following",
      count: followingCount,
      icon: UserPlus,

      // Blue
      bg: "bg-[#E7F0F6]",
      iconBg: "bg-[#D4E5EF]",
      iconColor: "text-[#3B718E]",
      activeBg: "bg-[#DCEBF3]",
      activeBorder: "border-[#6197B0]",
    },

    {
      id: "pending",
      title: "Pending",
      count: pendingCount,
      icon: Clock3,

      // Warm amber
      bg: "bg-[#F8F1DF]",
      iconBg: "bg-[#F1E5C5]",
      iconColor: "text-[#9A7532]",
      activeBg: "bg-[#F5EBD3]",
      activeBorder: "border-[#C9A85B]",
    },

    {
      id: "connected",
      title: "Connected",
      count: connectedCount,
      icon: UserRoundCheck,

      // Soft purple
      bg: "bg-[#EEEAF6]",
      iconBg: "bg-[#E0D8EE]",
      iconColor: "text-[#6E5A91]",
      activeBg: "bg-[#E6E0F0]",
      activeBorder: "border-[#8C78AE]",
    },
  ];

  const filteredConnections = connections.filter(
    (connection) => connection.type === activeCategory
  );

  const activeCategoryData = categories.find(
    (category) => category.id === activeCategory
  );

  // Action buttons
  const renderAction = (connection) => {
    switch (activeCategory) {
      case "follower":
        return (
          <button
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-[#17383A]
              text-white
              text-xs font-medium
              hover:bg-[#285557]
              hover:scale-105
              active:scale-95
              transition-all duration-200
              cursor-pointer
            "
          >
            <UserPlus size={14} />
            Follow Back
          </button>
        );

      case "following":
        return (
          <button
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-[#E7F0F6]
              text-[#3B718E]
              text-xs font-medium
              hover:bg-[#D4E5EF]
              transition-all duration-200
              cursor-pointer
            "
          >
            <UserCheck size={14} />
            Following
          </button>
        );

      case "pending":
        return (
          <div className="flex items-center gap-2">
            <button
              className="
                flex items-center gap-2
                px-3 py-2
                rounded-xl
                bg-[#17383A]
                text-white
                text-xs font-medium
                hover:bg-[#285557]
                transition-all duration-200
                cursor-pointer
              "
            >
              <UserCheck size={14} />
              Accept
            </button>

            <button
              className="
                w-9 h-9
                rounded-xl
                flex items-center justify-center
                bg-[#F7EAEA]
                text-gray-500
                hover:bg-red-50
                hover:text-red-500
                transition-all duration-200
                cursor-pointer
              "
            >
              <UserX size={15} />
            </button>
          </div>
        );

      case "connected":
        return (
          <button
            onClick={() =>
              navigate(`/message/${connection.user.id}`)
            }
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-[#EEEAF6]
              text-[#6E5A91]
              text-xs font-medium
              hover:bg-[#E0D8EE]
              transition-all duration-200
              cursor-pointer
            "
          >
            <MessageCircle size={14} />
            Message
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEAF6] px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#17383A]">
            Connections
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your connections and discover people.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  group
                  text-left
                  border
                  rounded-[24px]
                  p-5
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-md
                  ${category.bg}
                  ${
                    isActive
                      ? `${category.activeBg} ${category.activeBorder} shadow-md`
                      : "border-transparent"
                  }
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-10 h-10
                    rounded-xl
                    flex items-center justify-center
                    ${category.iconBg}
                    ${category.iconColor}
                    transition-all duration-200
                    group-hover:scale-105
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Count */}
                <div className="mt-4 text-3xl font-bold text-[#17383A]">
                  {category.count}
                </div>

                {/* Title */}
                <p className="mt-1 text-sm font-medium text-[#587070]">
                  {category.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Users Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#17383A]">
                {activeCategoryData?.title}
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                {filteredConnections.length} people
              </p>
            </div>
          </div>

          {/* User Cards */}
          <div className="space-y-3">
            {filteredConnections.map((connection) => (
              <div
                key={connection.id}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-4
                  p-4
                  rounded-[22px]
                  bg-white/80
                  border
                  border-[#DCE9E7]
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-[2px]
                  hover:shadow-md
                  hover:border-[#BFD5D2]
                "
              >

                {/* User */}
                <div className="flex items-center gap-4 min-w-0 hover:cursor-pointer">
                  <img
                    onClick={() =>
                      navigate(`/Profile/${connection.user.id}`)
                    }
                    src={connection.user.dp}
                    alt={connection.user.name}
                    className="
                      w-12 h-12
                      rounded-full
                      object-cover
                      ring-2 ring-white
                      transition-transform
                      duration-200
                      group-hover:scale-105
                      cursor-pointer
                    "
                  />

                  <div className="min-w-0">
                    <h3
                      onClick={() =>
                        navigate(`/Profile/${connection.user.id}`)
                      }
                      className="
                        text-sm
                        font-semibold
                        text-[#17383A]
                        truncate
                        group-hover:text-[#285557]
                        transition-colors
                        cursor-pointer
                      "
                    >
                      {connection.user.name}
                    </h3>

                    <p
                      className="text-xs text-gray-400 truncate cursor-pointer"
                      onClick={() =>
                        navigate(`/Profile/${connection.user.id}`)
                      }
                    >
                      {connection.user.username}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-1">
                      {connection.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {renderAction(connection)}
                </div>

              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredConnections.length === 0 && (
            <div
              className="
                py-12
                text-center
                rounded-[24px]
                bg-white/60
                border
                border-dashed
                border-[#C9D2D0]
              "
            >
              <Users
                size={28}
                className="mx-auto text-[#17383A]"
              />

              <p className="mt-3 text-sm font-medium text-[#17383A]">
                No {activeCategoryData?.title.toLowerCase()} found
              </p>

              <p className="text-xs text-gray-400 mt-1">
                There are no people in this category yet.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Connections;