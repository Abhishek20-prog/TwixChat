
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  Trash2,
  LoaderCircle,
  Heart,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const Comments = () => {
  const { postId } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = useSelector((state) => state.user.user);
  const initialPost = location.state?.post || null;

  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(!initialPost);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getCurrentToken = useCallback(async () => {
    const token = await getToken();

    if (!token) {
      throw new Error("Please sign in to continue.");
    }

    return token;
  }, [getToken]);

  const fetchPost = useCallback(async () => {
    try {
      setPostLoading(true);

      const token = await getCurrentToken();
      const response = await fetch(`${API_URL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load post.");
      }

      setPost(data.post);
    } catch (err) {
      setError(err.message || "Unable to load post.");
    } finally {
      setPostLoading(false);
    }
  }, [postId, getCurrentToken]);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getCurrentToken();
      const response = await fetch(
        `${API_URL}/api/post/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load comments.");
      }

      setComments(data.comments || []);
    } catch (err) {
      setError(err.message || "Unable to load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId, getCurrentToken]);

  useEffect(() => {
    if (!initialPost) {
      fetchPost();
    } else {
      setPost(initialPost);
      setPostLoading(false);
    }

    fetchComments();
  }, [initialPost, fetchPost, fetchComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.error("Write a comment first.");
      return;
    }

    try {
      setSubmitting(true);

      const token = await getCurrentToken();
      const response = await fetch(
        `${API_URL}/api/post/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: trimmedContent }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add comment.");
      }

      setComments((previous) => [...previous, data.comment]);
      setContent("");
      setPost((previous) =>
        previous
          ? {
              ...previous,
              commentsCount: (previous.commentsCount || 0) + 1,
            }
          : previous
      );

      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.message || "Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const token = await getCurrentToken();
      const response = await fetch(
        `${API_URL}/api/post/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete comment.");
      }

      setComments((previous) =>
        previous.filter((comment) => String(comment._id) !== String(commentId))
      );

      setPost((previous) =>
        previous
          ? {
              ...previous,
              commentsCount: Math.max(0, (previous.commentsCount || 0) - 1),
            }
          : previous
      );

      toast.success("Comment deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete comment.");
    }
  };

  const author =
    post?.userId && typeof post.userId === "object" ? post.userId : {};

  const authorName =
    author.full_name || author.username || "TwixChat User";

  const media = [
    ...(Array.isArray(post?.image_url) ? post.image_url : []),
    ...(Array.isArray(post?.video_url) ? post.video_url : []),
  ];

  const currentUserId = currentUser?._id;

  return (
    <div className="min-h-full bg-[#F5FAF9] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="rounded-xl p-2 text-[#155E63] transition hover:bg-[#E8F5F3]"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-[#17383A]">Post comments</h1>
            <p className="text-sm text-gray-500">
              Join the conversation.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <section className="overflow-hidden rounded-2xl border border-[#58A6A6]/20 bg-white shadow-sm">
            {postLoading ? (
              <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-gray-500">
                <LoaderCircle className="animate-spin text-[#155E63]" />
                Loading post...
              </div>
            ) : !post ? (
              <div className="p-8 text-center text-sm text-gray-500">
                {error || "This post could not be found."}
                <button
                  type="button"
                  onClick={fetchPost}
                  className="mt-3 block w-full font-semibold text-[#155E63]"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                  {author.profile_picture ? (
                    <img
                      src={author.profile_picture}
                      alt={authorName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#155E63] to-[#F26B4D] font-bold text-white">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#17383A]">
                      {authorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{author.username || "user"}
                    </p>
                  </div>
                </div>

                {media.length > 0 && (
                  <div className="bg-gray-50">
                    {post.video_url?.length > 0 ? (
                      <video
                        src={post.video_url[0]}
                        controls
                        playsInline
                        className="max-h-[65vh] w-full object-contain"
                      />
                    ) : (
                      <img
                        src={media[0]}
                        alt="Post"
                        className="max-h-[65vh] w-full object-contain"
                      />
                    )}
                  </div>
                )}

                {post.content && (
                  <div className="p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                      <span className="mr-2 font-semibold text-[#17383A]">
                        {author.username || authorName}
                      </span>
                      {post.content}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
                  <Heart size={17} className="text-[#F26B4D]" />
                  {Array.isArray(post.likes) ? post.likes.length : 0} likes
                  <span className="mx-1">·</span>
                  {comments.length} loaded comments
                </div>

                <p className="px-4 pb-4 text-[11px] uppercase tracking-wide text-gray-400">
                  {post.createdAt && moment(post.createdAt).isValid()
                    ? moment(post.createdAt).fromNow()
                    : ""}
                </p>
              </>
            )}
          </section>

          <section className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-[#58A6A6]/20 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#155E63] to-[#58A6A6] text-white">
                <MessageCircle size={21} />
              </div>
              <div>
                <h2 className="font-bold text-[#17383A]">Comments</h2>
                <p className="text-sm text-gray-500">
                  {comments.length} {comments.length === 1 ? "comment" : "comments"}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-b border-gray-100 bg-[#F9FCFB] p-4"
            >
              <label
                htmlFor="comment-content"
                className="mb-2 block text-sm font-semibold text-[#17383A]"
              >
                Join the conversation
              </label>

              <textarea
                id="comment-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write something thoughtful..."
                maxLength={2000}
                rows={3}
                className="w-full resize-y rounded-xl border border-[#58A6A6]/30 bg-white p-3 text-sm outline-none transition focus:border-[#155E63] focus:ring-2 focus:ring-[#58A6A6]/20"
              />

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-gray-400">
                  {content.length}/2000
                </span>

                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#155E63] to-[#58A6A6] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {submitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </form>

            <div className="min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center gap-3 p-10 text-sm text-gray-500">
                  <LoaderCircle size={20} className="animate-spin text-[#155E63]" />
                  Loading comments...
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={fetchComments}
                    className="mt-3 text-sm font-semibold text-[#155E63] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : comments.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5F3] text-[#155E63]">
                    <MessageCircle size={26} />
                  </div>
                  <h3 className="font-semibold text-[#17383A]">
                    No comments yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Be the first to share your thoughts.
                  </p>
                </div>
              ) : (
                comments.map((comment) => {
                  const commentAuthor =
                    comment.userId && typeof comment.userId === "object"
                      ? comment.userId
                      : {};

                  const name =
                    commentAuthor.full_name ||
                    commentAuthor.username ||
                    "TwixChat User";

                  const isOwnComment =
                    currentUserId &&
                    commentAuthor._id &&
                    String(currentUserId) === String(commentAuthor._id);

                  return (
                    <div key={comment._id} className="flex gap-3 p-4">
                      {commentAuthor.profile_picture ? (
                        <img
                          src={commentAuthor.profile_picture}
                          alt={name}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#155E63] to-[#F26B4D] text-sm font-bold text-white">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold text-[#17383A]">
                            {name}
                          </span>
                          {commentAuthor.username && (
                            <span className="text-xs text-gray-400">
                              @{commentAuthor.username}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {comment.createdAt
                              ? moment(comment.createdAt).fromNow()
                              : "Just now"}
                          </span>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                          {comment.content}
                        </p>

                        {isOwnComment && (
                          <button
                            type="button"
                            onClick={() => handleDelete(comment._id)}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition hover:text-red-500"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Comments;
