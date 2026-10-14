
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useSelector((state) => state.user);

  const postId = post?._id || post?.id;
  const author =
    post?.userId && typeof post.userId === "object"
      ? post.userId
      : post?.user && typeof post.user === "object"
        ? post.user
        : {};

  const authorId = author._id || author.id;
  const authorName =
    author.full_name || author.name || author.username || "TwixChat User";
  const username = author.username || "user";
  const profilePicture = author.profile_picture || "";
  const currentUserId = user?._id || user?.id;

  const images = Array.isArray(post?.image_url)
    ? post.image_url
    : post?.image_url
      ? [post.image_url]
      : [];

  const videos = Array.isArray(post?.video_url)
    ? post.video_url
    : post?.video_url
      ? [post.video_url]
      : [];

  const isVideoPost = String(post?.post_type || "").startsWith("video");
  const media = isVideoPost ? videos : images;

  const postLikes = Array.isArray(post?.likes) ? post.likes : [];
  const postComments = Array.isArray(post?.comments) ? post.comments : [];

  const initialLiked = postLikes.some((like) => {
    const id = typeof like === "object" ? like?._id : like;
    return currentUserId && String(id) === String(currentUserId);
  });

  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(postLikes.length);
  const [likeLoading, setLikeLoading] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(postLikes.length);
  }, [postId, initialLiked, postLikes.length]);

  useEffect(() => {
    setMediaIndex(0);
    setMediaError(false);
    setAvatarError(false);
    setShowMenu(false);
  }, [postId]);

  useEffect(() => {
    setAvatarError(false);
  }, [profilePicture]);

  const commentCount = Number.isFinite(post?.commentsCount)
    ? post.commentsCount
    : postComments.length;

  const openProfile = () => {
    if (authorId) navigate(`/profile/${authorId}`);
  };

  const openComments = () => {
    if (postId) {
      navigate(`/post/${postId}/comments`, {
        state: { post },
      });
    }
  };

  const handleLike = async () => {
    if (!postId || likeLoading) return;

    setLikeLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        toast.error("Please sign in to like posts.");
        return;
      }

      const response = await fetch(`${API_URL}/api/post/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update like.");
      }

      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (error) {
      toast.error(error.message || "Could not update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = async () => {
    if (!postId) return;

    const url = `${window.location.origin}/post/${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by @${username}`,
          text: post.content || "",
          url,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Post link copied!");
      } else {
        window.prompt("Copy this post link:", url);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Unable to share this post.");
      }
    } finally {
      setShowMenu(false);
    }
  };

  const changeMedia = (direction) => {
    setMediaIndex((index) =>
      Math.min(Math.max(index + direction, 0), media.length - 1)
    );
    setMediaError(false);
  };

  return (
    <article className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#58A6A6]/20 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={openProfile}
            disabled={!authorId}
            aria-label={`Open ${authorName}'s profile`}
            className="shrink-0 disabled:cursor-default"
          >
            {profilePicture && !avatarError ? (
              <img
                src={profilePicture}
                alt={authorName}
                onError={() => setAvatarError(true)}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-[#58A6A6]/30"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#155E63] to-[#F26B4D] font-bold text-white">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          <div className="min-w-0">
            <button
              type="button"
              onClick={openProfile}
              disabled={!authorId}
              className="block max-w-full truncate text-left text-sm font-semibold text-[#17383A] hover:text-[#F26B4D]"
            >
              {authorName}
            </button>
            <p className="truncate text-xs text-gray-500">@{username}</p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Post options"
            onClick={() => setShowMenu((value) => !value)}
            className="rounded-full p-2 text-[#17383A] hover:bg-[#E8F5F3]"
          >
            {showMenu ? <X size={20} /> : <MoreHorizontal size={21} />}
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={handleShare}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#E8F5F3]"
              >
                Share post
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  openComments();
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#E8F5F3]"
              >
                View comments
              </button>
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50"
              >
                Close menu
              </button>
            </div>
          )}
        </div>
      </div>

      {media.length > 0 && (
        <div className="relative overflow-hidden bg-gray-100">
          {mediaError ? (
            <div className="flex aspect-square flex-col items-center justify-center gap-2 text-sm text-gray-500">
              Unable to load media
              <button
                type="button"
                onClick={() => setMediaError(false)}
                className="font-semibold text-[#155E63]"
              >
                Try again
              </button>
            </div>
          ) : isVideoPost ? (
            <video
              key={media[mediaIndex]}
              src={media[mediaIndex]}
              controls
              playsInline
              preload="metadata"
              onError={() => setMediaError(true)}
              className="block max-h-[600px] w-full object-contain"
            />
          ) : (
            <img
              key={media[mediaIndex]}
              src={media[mediaIndex]}
              alt={`Post by ${authorName}`}
              loading="lazy"
              onError={() => setMediaError(true)}
              className="block max-h-[600px] w-full object-contain"
            />
          )}

          {media.length > 1 && (
            <>
              {mediaIndex > 0 && (
                <button
                  type="button"
                  onClick={() => changeMedia(-1)}
                  aria-label="Previous media"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-[#155E63]"
                >
                  <ChevronLeft size={22} />
                </button>
              )}
              {mediaIndex < media.length - 1 && (
                <button
                  type="button"
                  onClick={() => changeMedia(1)}
                  aria-label="Next media"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-[#155E63]"
                >
                  <ChevronRight size={22} />
                </button>
              )}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                {mediaIndex + 1} / {media.length}
              </span>
            </>
          )}
        </div>
      )}

      {post.content && (
        <div className="px-4 pt-3">
          {media.length === 0 ? (
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#17383A]">
              {post.content}
            </p>
          ) : (
            <p className="break-words text-sm leading-6 text-gray-700">
              <button
                type="button"
                onClick={openProfile}
                className="mr-2 font-semibold text-[#17383A] hover:text-[#F26B4D]"
              >
                {username}
              </button>
              {post.content}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleLike}
            disabled={likeLoading}
            aria-label={liked ? "Unlike post" : "Like post"}
            aria-pressed={liked}
            className={`rounded-full p-2 transition hover:scale-110 disabled:opacity-60 ${
              liked
                ? "text-[#F26B4D]"
                : "text-[#17383A] hover:bg-[#E8F5F3]"
            }`}
          >
            <Heart size={23} fill={liked ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            onClick={openComments}
            aria-label="Open comments"
            className="rounded-full p-2 text-[#17383A] hover:bg-[#E8F5F3] hover:text-[#155E63]"
          >
            <MessageCircle size={23} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share post"
            className="rounded-full p-2 text-[#17383A] hover:bg-[#E8F5F3] hover:text-[#155E63]"
          >
            <Share2 size={22} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setBookmarked((value) => !value)}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
          className={`rounded-full p-2 hover:bg-[#E8F5F3] ${
            bookmarked ? "text-[#F9B233]" : "text-[#17383A]"
          }`}
        >
          <Bookmark size={22} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="px-4 pt-1">
        <p className="text-sm font-semibold text-[#17383A]">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </p>
      </div>

      {postComments.slice(0, 2).length > 0 && (
        <div className="space-y-2 px-4 pb-2 pt-2">
          {postComments.slice(0, 2).map((comment) => {
            const commentAuthor =
              comment.userId && typeof comment.userId === "object"
                ? comment.userId
                : {};

            return (
              <p
                key={comment._id}
                className="break-words text-sm text-gray-600"
              >
                <span className="mr-2 font-semibold text-[#17383A]">
                  {commentAuthor.username ||
                    commentAuthor.full_name ||
                    "TwixChat User"}
                </span>
                {comment.content}
              </p>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between px-4 pb-2">
        <button
          type="button"
          onClick={openComments}
          className="text-sm text-gray-500 hover:text-[#155E63]"
        >
          View all {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </button>
      </div>

      <div className="px-4 pb-4 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {post.createdAt && moment(post.createdAt).isValid()
          ? moment(post.createdAt).fromNow()
          : "Just now"}
      </div>
    </article>
  );
};

export default PostCard;
