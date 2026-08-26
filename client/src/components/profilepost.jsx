import React from "react";
import { Play } from "lucide-react";

const ProfilePost = ({ posts }) => {
  return (
    <div className="mt-6">

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2">

        {posts.map((post) => (
          <div
            key={post.id}
            className="
              relative
              aspect-square
              overflow-hidden
              bg-[#E8F5F3]
              cursor-pointer
              group
            "
          >

            {/* Image Post */}
            {post.type === "image" && (
              <img
                src={post.media}
                alt={post.content}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />
            )}

            {/* Video Post */}
            {post.type === "video" && (
              <>
                <video
                  src={post.media}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                {/* Video Icon */}
                <div
                  className="
                    absolute
                    top-3
                    right-3
                    w-8
                    h-8
                    rounded-full
                    bg-black/50
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Play size={15} fill="white" />
                </div>
              </>
            )}

            {/* Text Post */}
            {post.type === "text" && (
              <div
                className="
                  w-full
                  h-full
                  p-4
                  flex
                  items-center
                  justify-center
                  bg-[#DDF0ED]
                  transition-all
                  duration-300
                  group-hover:bg-[#CDE6E2]
                "
              >
                <p
                  className="
                    text-sm
                    md:text-base
                    text-[#17383A]
                    font-medium
                    text-center
                    line-clamp-5
                  "
                >
                  {post.content}
                </p>
              </div>
            )}

            {/* Hover Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-black/0
                group-hover:bg-black/30
                transition-all
                duration-300
              "
            />

            {/* Engagement on Hover */}
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                gap-5
                text-white
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
                font-semibold
                text-sm
              "
            >
              <span>♥ {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>

          </div>
        ))}

      </div>

      {/* No Posts */}
      {posts.length === 0 && (
        <div className="py-16 text-center">

          <p className="text-sm font-medium text-[#17383A]">
            No posts yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Posts will appear here.
          </p>

        </div>
      )}

    </div>
  );
};

export default ProfilePost;