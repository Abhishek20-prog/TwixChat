import React from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Play,
} from "lucide-react";
import moment from "moment";

const ProfilePost = ({ posts }) => {
  return (
    <div className="w-full mt-8">

      {/* Masonry-style wall */}
      <div className="columns-1 md:columns-2 gap-5 space-y-5">

        {posts.map((post, index) => (

          <article
            key={post.id}
            className="
              group
              relative
              break-inside-avoid
              overflow-hidden
              rounded-[26px]
              bg-white
              border
              border-[#D8E9E6]
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >

            {/* =============================== */}
            {/* IMAGE */}
            {/* =============================== */}

            {post.type === "image" && (
              <div className="relative">

                <img
                  src={post.media}
                  alt={post.content}
                  className="
                    w-full
                    max-h-[520px]
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                {/* Dark hover layer */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/70
                    via-transparent
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                  "
                />

                {/* Number */}

                <span
                  className="
                    absolute
                    top-4
                    left-4
                    px-3
                    py-1
                    rounded-full
                    bg-white/80
                    backdrop-blur-md
                    text-[10px]
                    font-bold
                    text-[#17383A]
                  "
                >

                </span>

                {/* Caption */}

                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    right-5
                    text-white
                    opacity-0
                    translate-y-4
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all
                    duration-300
                  "
                >

                  {post.location && (
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin size={11} />
                      <span className="text-[10px]">
                        {post.location}
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-medium">
                    {post.content}
                  </p>

                </div>

                {/* Actions */}

                <Actions post={post} />

              </div>
            )}


            {/* =============================== */}
            {/* VIDEO */}
            {/* =============================== */}

            {post.type === "video" && (
              <div className="relative bg-[#17383A]">

                <video
                  src={post.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="
                    w-full
                    max-h-[520px]
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/10
                    group-hover:bg-black/50
                    transition-all
                    duration-300
                  "
                />

                {/* Play button */}

                <div
                  className="
                    absolute
                    top-4
                    right-4
                    w-10
                    h-10
                    rounded-full
                    bg-white/90
                    flex
                    items-center
                    justify-center
                    text-[#17383A]
                    transition-all
                    duration-300
                    group-hover:scale-0
                  "
                >
                  <Play
                    size={16}
                    fill="currentColor"
                  />
                </div>

                {/* Video caption */}

                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    right-5
                    text-white
                    opacity-0
                    translate-y-4
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all
                    duration-300
                  "
                >

                  <span className="text-[9px] tracking-[3px] opacity-70">
                    VIDEO
                  </span>

                  <p className="mt-2 text-sm font-semibold">
                    {post.content}
                  </p>

                </div>

                <Actions post={post} dark />

              </div>
            )}


            {/* =============================== */}
            {/* TEXT */}
            {/* =============================== */}
            {/* =============================== */}
            {/* TEXT POST */}
            {/* =============================== */}

            {post.type === "text" && (
              <div
                className="
      relative
      min-h-[280px]
      p-7
      flex
      items-center
      justify-center
      overflow-hidden
      bg-[#E8F5F3]
      cursor-pointer
      transition-all
      duration-300
      group-hover:bg-[#DDF0ED]
    "
              >

                {/* Decorative quote */}

                <span
                  className="
        absolute
        -top-8
        -left-2
        text-[180px]
        font-serif
        text-[#C8E2DF]
        leading-none
        pointer-events-none
        transition-transform
        duration-500
        group-hover:scale-110
      "
                >
                  “
                </span>

                <span
                  className="
        absolute
        -bottom-16
        -right-2
        text-[180px]
        font-serif
        text-[#D5EBE8]
        leading-none
        pointer-events-none
        transition-transform
        duration-500
        group-hover:scale-110
      "
                >
                  ”
                </span>

                {/* Text */}

                <div
                  className="
        relative
        z-10
        text-center
        pointer-events-none
        transition-all
        duration-300
        group-hover:opacity-0
        group-hover:scale-95
      "
                >

                  <p
                    className="
          text-lg
          md:text-xl
          leading-relaxed
          font-semibold
          text-[#17383A]
        "
                  >
                    {post.content}
                  </p>

                  <div className="mt-5">

                    <span className="text-[10px] text-[#5A928C]">
                      {moment(post.createdAt).fromNow()}
                    </span>

                  </div>

                </div>

                {/* Hover actions */}

                <div
                  className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        opacity-0
        scale-90
        group-hover:opacity-100
        group-hover:scale-100
        transition-all
        duration-300
        z-20
      "
                >

                  <div
                    className="
          flex
          items-center
          gap-1
          p-2
          rounded-2xl
          bg-white/95
          shadow-xl
          backdrop-blur-md
        "
                  >

                    <button
                      className="
            flex
            items-center
            gap-1
            px-3
            py-2
            rounded-xl
            text-xs
            font-semibold
            text-[#17383A]
            hover:bg-red-50
            hover:text-red-500
            cursor-pointer
            transition-all
            hover:scale-105
          "
                    >
                      <Heart size={15} />
                      {post.likes}
                    </button>

                    <button
                      className="
            flex
            items-center
            gap-1
            px-3
            py-2
            rounded-xl
            text-xs
            font-semibold
            text-[#17383A]
            hover:bg-[#E8F5F3]
            cursor-pointer
            transition-all
            hover:scale-105
          "
                    >
                      <MessageCircle size={15} />
                      {post.comments}
                    </button>

                    <button
                      className="
            w-9
            h-9
            flex
            items-center
            justify-center
            rounded-xl
            text-[#17383A]
            hover:bg-[#E8F5F3]
            cursor-pointer
            transition-all
            hover:scale-105
          "
                    >
                      <Share2 size={15} />
                    </button>

                  </div>

                </div>

              </div>
            )}


            {/* =============================== */}
            {/* FOOTER */}
            {/* =============================== */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-3
                bg-white
              "
            >

              <span className="text-[10px] text-gray-400">
                {post.likes} likes
              </span>

              <span className="text-[10px] text-gray-400">
                {post.comments} comments
              </span>

            </div>

          </article>

        ))}

      </div>

    </div>
  );
};


/* ================================= */
/* ACTION BUTTONS */
/* ================================= */

const Actions = ({ post, dark = false }) => {

  return (
    <div
      className={`
        absolute
        inset-0
        flex
        items-center
        justify-center
        opacity-0
        scale-90
        group-hover:opacity-100
        group-hover:scale-100
        transition-all
        duration-300
        pointer-events-none
      `}
    >

      <div
        className={`
          pointer-events-auto
          flex
          items-center
          gap-1
          p-2
          rounded-2xl
          shadow-xl
          backdrop-blur-md
          ${dark
            ? "bg-white/15"
            : "bg-white/95"
          }
        `}
      >

        <button
          className={`
            flex
            items-center
            gap-1
            px-3
            py-2
            rounded-xl
            text-xs
            font-semibold
            cursor-pointer
            transition-all
            hover:scale-105
            ${dark
              ? "text-white hover:bg-white/10"
              : "text-[#17383A] hover:bg-red-50 hover:text-red-500"
            }
          `}
        >
          <Heart size={15} />
          {post.likes}
        </button>

        <button
          className={`
            flex
            items-center
            gap-1
            px-3
            py-2
            rounded-xl
            text-xs
            font-semibold
            cursor-pointer
            transition-all
            hover:scale-105
            ${dark
              ? "text-white hover:bg-white/10"
              : "text-[#17383A] hover:bg-[#E8F5F3]"
            }
          `}
        >
          <MessageCircle size={15} />
          {post.comments}
        </button>

        <button
          className={`
            w-9
            h-9
            flex
            items-center
            justify-center
            rounded-xl
            cursor-pointer
            transition-all
            hover:scale-105
            ${dark
              ? "text-white hover:bg-white/10 "
              : "text-[#17383A] hover:bg-[#E8F5F3]"
            }
          `}
        >
          <Share2 size={15} />
        </button>

      </div>

    </div>
  );
};

export default ProfilePost;