import React from "react";
import moment from "moment";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">

        <div className="flex items-center gap-3">

          {/* Profile Picture */}
          <img
          onClick={()=>navigate('/profile/'+ post.user.id)}
            src={post.user.dp}
            alt={post.user.name}
            className="
              w-10 h-10 rounded-full object-cover
              cursor-pointer
              transition-all duration-200
              hover:scale-110
              hover:ring-2
              hover:ring-gray-300
              hover:shadow-md
            "
          />

          {/* User Information */}
          <div className="leading-tight">

            {/* Name */}
            <h3
            onClick={()=>navigate('/profile/'+ post.user.id)}
              className="
                font-semibold text-sm
                cursor-pointer
                transition-colors duration-200
                hover:text-gray-500
              "
            >
              {post.user.name}
            </h3>

            {/* Username */}
            <p
            onClick={()=>navigate('/profile/'+ post.user.id)}
              className="
                text-xs text-gray-500
                cursor-pointer
                transition-colors duration-200
                hover:text-gray-800
              "
            >
              {post.user.username}
            </p>

            {/* Location */}
            {post.location && (
              <p className="text-xs text-gray-400 mt-1">
                {post.location}
              </p>
            )}

          </div>
        </div>

        {/* More Options */}
        <button
          className="
            p-2 rounded-full
            cursor-pointer
            transition-all duration-200
            hover:bg-gray-100
            hover:scale-110
            active:scale-95
          "
        >
          <MoreHorizontal size={20} />
        </button>

      </div>

      {/* Post Content */}
      {post.type === "text" ? (

        <div className="px-5 py-8">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

      ) : post.type === "video" ? (

        <div
          className="
            w-full bg-black overflow-hidden
            cursor-pointer
          "
        >
          <video
            src={post.media}
            controls
            className="
              w-full max-h-[600px] object-contain
              transition-all duration-300
              hover:scale-[1.02]
            "
          />
        </div>

      ) : (

        <div className="w-full aspect-square bg-gray-100 overflow-hidden">
          <img
            src={post.media}
            alt="Post"
            className="
              w-full h-full object-cover
              transition-transform duration-300
              hover:scale-[1.02]
            "
          />
        </div>

      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">

        <div className="flex items-center gap-2">

          {/* Like */}
          <button
            className="
              p-2 rounded-full
              cursor-pointer
              transition-all duration-200
              hover:bg-gray-100
              hover:scale-110
              active:scale-90
            "
          >
            <Heart size={23} />
          </button>

          {/* Comment */}
          <button
            className="
              p-2 rounded-full
              cursor-pointer
              transition-all duration-200
              hover:bg-gray-100
              hover:scale-110
              active:scale-90
            "
          >
            <MessageCircle size={23} />
          </button>

          {/* Share */}
          <button
            className="
              p-2 rounded-full
              cursor-pointer
              transition-all duration-200
              hover:bg-gray-100
              hover:scale-110
              active:scale-90
            "
          >
            <Share2 size={23} />
          </button>

        </div>

        {/* Bookmark */}
        <button
          className="
            p-2 rounded-full
            cursor-pointer
            transition-all duration-200
            hover:bg-gray-100
            hover:scale-110
            active:scale-90
          "
        >
          <Bookmark size={23} />
        </button>

      </div>

      {/* Likes */}
      <div className="px-4">
        <p className="font-semibold text-sm">
          {post.likes} likes
        </p>
      </div>

      {/* Caption */}
      {post.content && post.type !== "text" && (
        <div className="px-4 py-2">
          <p className="text-sm">

            <span
              className="
                font-semibold mr-2
                cursor-pointer
                transition-colors duration-200
                hover:text-gray-500
              "
            >
              {post.user.username}
            </span>

            {post.content}

          </p>
        </div>
      )}

      {/* Comments */}
      <div className="px-4 pb-2">
        <button
          className="
            text-sm text-gray-500
            cursor-pointer
            transition-colors duration-200
            hover:text-gray-800
          "
        >
          View all {post.comments} comments
        </button>
      </div>

      {/* Time */}
      <div className="px-4 pb-4">
        <p className="text-xs text-gray-400">
          {moment(post.createdAt).fromNow()}
        </p>
      </div>

    </div>
  );
};

export default PostCard;