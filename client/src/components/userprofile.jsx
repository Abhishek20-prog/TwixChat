import React from "react";
import {
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Edit,
  UserPlus,
  Users,
} from "lucide-react";

const UserProfile = ({ user, posts, setshowedit, profileID }) => {
  return (
    <div className="bg-white px-6 pb-6">

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        {/* DP + Basic Info */}
        <div className="flex items-end gap-4">

          {/* Profile Picture */}
          <div className="-mt-14 relative">
            <img
              src={user.dp}
              alt={user.name}
              className="
                w-28
                h-28
                rounded-full
                object-cover
                border-4
                border-white
                shadow-md
              "
            />

            {user.status === "Online" && (
              <span
                className="
                  absolute
                  bottom-2
                  right-2
                  w-4
                  h-4
                  rounded-full
                  bg-[#39B77A]
                  border-2
                  border-white
                "
              />
            )}
          </div>

          {/* Name */}
          <div className="pb-1">

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#17383A]">
                {user.name}
              </h1>

              {user.pronouns && (
                <span className="text-xs text-gray-400">
                  {user.pronouns}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {user.username}
            </p>

          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => setshowedit(true)}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            rounded-xl
            bg-[#17383A]
            text-white
            text-sm
            font-medium
            transition-all
            duration-200
            hover:bg-[#285557]
            hover:-translate-y-0.5
            active:scale-95
          "
        >
          <Edit size={16} />
          Edit Profile
        </button>

      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mt-5">
          <p className="text-sm leading-relaxed text-gray-600">
            {user.bio}
          </p>
        </div>
      )}

      {/* Profile Details */}
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">

        {user.work && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Briefcase size={16} className="text-[#17383A]" />
            <span>{user.work}</span>
          </div>
        )}

        {user.workplace && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} className="text-[#17383A]" />
            <span>{user.workplace}</span>
          </div>
        )}

        {user.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="text-[#17383A]" />
            <span>{user.location}</span>
          </div>
        )}

        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noreferrer"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-[#285557]
              hover:underline
            "
          >
            <LinkIcon size={16} />
            Website
          </a>
        )}

      </div>

      {/* Hobbies */}
      {user.hobbies?.length > 0 && (
        <div className="mt-5">

          <p className="text-xs font-semibold text-[#17383A] mb-2">
            Interests
          </p>

          <div className="flex flex-wrap gap-2">
            {user.hobbies.map((hobby, index) => (
              <span
                key={index}
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-[#E8F5F3]
                  text-[#285557]
                  text-xs
                  font-medium
                "
              >
                {hobby}
              </span>
            ))}
          </div>

        </div>
      )}

      {/* Stats */}
      <div
        className="
          flex
          items-center
          gap-8
          mt-6
          pt-5
          border-t
          border-gray-100
        "
      >

        <div className="text-center">
          <p className="text-lg font-bold text-[#17383A]">
            {posts?.length || 0}
          </p>

          <p className="text-xs text-gray-400">
            Posts
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-[#17383A]">
            {user.followers || 0}
          </p>

          <p className="text-xs text-gray-400">
            Followers
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-[#17383A]">
            {user.following || 0}
          </p>

          <p className="text-xs text-gray-400">
            Following
          </p>
        </div>

      </div>

    </div>
  );
};

export default UserProfile;