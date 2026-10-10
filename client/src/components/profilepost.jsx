
import React, { useEffect, useState } from "react";
import {
    Heart,
    MessageCircle,
    Share2,
    MoreVertical,
    Pencil,
    Trash2,
    X,
    LoaderCircle,
    Check,
} from "lucide-react";
import moment from "moment";
import { useAuth } from "@clerk/react";

const API_BASE_URL = (
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    ""
).replace(/\/$/, "");

const ProfilePost = ({
    posts = [],
    canManagePosts = false,
    onPostDeleted,
}) => {
    const { getToken } = useAuth();

    const [localPosts, setLocalPosts] = useState(posts);
    const [openMenu, setOpenMenu] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [deletingPost, setDeletingPost] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    const getType = (post) => {
        if (post.post_type) return post.post_type;
        return post.type || "text";
    };

    const getMedia = (post) => {
        if (Array.isArray(post.image_url) && post.image_url.length) {
            return post.image_url[0];
        }

        return post.video_url || post.media || "";
    };

    const getCount = (value) => {
        if (Array.isArray(value)) return value.length;
        return Number(value) || 0;
    };

    const openEditDialog = (post) => {
        setEditingPost(post);
        setEditContent(post.content || "");
        setError("");
        setOpenMenu(null);
    };

    const saveEdit = async () => {
        if (!editingPost?._id) {
            setError("This post does not have a valid database ID.");
            return;
        }

        if (!editContent.trim()) {
            setError("Caption cannot be empty.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token = await getToken();

            const response = await fetch(
                `${API_BASE_URL}/api/post/${editingPost._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: editContent.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not update post.");
            }

            setLocalPosts((currentPosts) =>
                currentPosts.map((post) =>
                    String(post._id || post.id) ===
                    String(editingPost._id || editingPost.id)
                        ? { ...post, ...data.post }
                        : post
                )
            );

            setEditingPost(null);
            setEditContent("");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingPost?._id) {
            setError("This post does not have a valid database ID.");
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const token = await getToken();

            const response = await fetch(
                `${API_BASE_URL}/api/post/${deletingPost._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not delete post.");
            }

           const deletedPostId = String(deletingPost._id || deletingPost.id);

setLocalPosts((currentPosts) =>
    currentPosts.filter(
        (post) => String(post._id || post.id) !== deletedPostId
    )
);

onPostDeleted?.(deletedPostId);

            setDeletingPost(null);
            setOpenMenu(null);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setDeleting(false);
        }
    };

    const Actions = ({ post, dark = false }) => (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none">
            <div
                className={`pointer-events-auto flex items-center gap-1 p-2 rounded-2xl shadow-xl backdrop-blur-md ${
                    dark ? "bg-white/15" : "bg-white/95"
                }`}
            >
                <span
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold ${
                        dark ? "text-white" : "text-[#17383A]"
                    }`}
                >
                    <Heart size={15} />
                    {getCount(post.likes)}
                </span>

                <span
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold ${
                        dark ? "text-white" : "text-[#17383A]"
                    }`}
                >
                    <MessageCircle size={15} />
                    {getCount(post.comments)}
                </span>

                <button
                    type="button"
                    aria-label="Share post"
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: "TwixChat post",
                                text: post.content || "Check out this post!",
                                url: window.location.href,
                            }).catch(() => {});
                        } else {
                            navigator.clipboard?.writeText(
                                window.location.href
                            ).catch(() => {});
                        }
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        dark
                            ? "text-white hover:bg-white/10"
                            : "text-[#17383A] hover:bg-[#E8F5F3]"
                    }`}
                >
                    <Share2 size={15} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="mt-8 w-full">
            {error && !editingPost && !deletingPost && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                    <button
                        type="button"
                        onClick={() => setError("")}
                        className="ml-3 font-semibold underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="columns-1 gap-5 space-y-5 md:columns-2">
                {localPosts.map((post, index) => {
                    const type = getType(post);
                    const media = getMedia(post);
                    const isVideo = type === "video";
                    const hasImage =
                        (type === "image" || type === "image_text") &&
                        Boolean(media);
                    const isText = type === "text";

                    return (
                        <article
                            key={post._id || post.id || index}
                            className="group relative mb-5 break-inside-avoid overflow-visible rounded-[26px] border border-[#D8E9E6] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {canManagePosts && post._id && (
                                <div className="absolute right-3 top-3 z-30">
                                    <button
                                        type="button"
                                        aria-label="Post options"
                                        aria-expanded={openMenu === post._id}
                                        onClick={() =>
                                            setOpenMenu((current) =>
                                                current === post._id
                                                    ? null
                                                    : post._id
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E9E6] bg-white/95 text-[#17383A] shadow-md transition hover:bg-[#E8F5F3]"
                                    >
                                        <MoreVertical size={19} />
                                    </button>

                                    {openMenu === post._id && (
                                        <div className="absolute right-0 top-11 w-44 overflow-hidden rounded-2xl border border-[#D8E9E6] bg-white p-1.5 shadow-xl">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditDialog(post)
                                                }
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#17383A] transition hover:bg-[#E8F5F3]"
                                            >
                                                <Pencil size={16} />
                                                Edit post
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeletingPost(post);
                                                    setOpenMenu(null);
                                                    setError("");
                                                }}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                                Delete post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {hasImage && (
                                <div className="relative overflow-hidden rounded-t-[26px]">
                                    <img
                                        src={media}
                                        alt={post.content || "Post image"}
                                        loading="lazy"
                                        className="w-full max-h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {post.content && (
                                        <div className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white opacity-0 translate-y-4 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                            {post.content}
                                        </div>
                                    )}

                                    <Actions post={post} />
                                </div>
                            )}

                            {isVideo && media && (
                                <div className="relative rounded-t-[26px] bg-[#17383A]">
                                    <video
                                        src={media}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        className="w-full max-h-[520px] rounded-t-[26px] object-contain"
                                    />

                                    {post.content && (
                                        <p className="p-4 text-sm text-white">
                                            {post.content}
                                        </p>
                                    )}
                                </div>
                            )}

                            {isText && (
                                <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-t-[26px] bg-[#E8F5F3] p-7 transition-colors duration-300 group-hover:bg-[#DDF0ED]">
                                    <span className="pointer-events-none absolute -left-2 -top-8 font-serif text-[180px] leading-none text-[#C8E2DF]">
                                        “
                                    </span>

                                    <span className="pointer-events-none absolute -bottom-16 -right-2 font-serif text-[180px] leading-none text-[#D5EBE8]">
                                        ”
                                    </span>

                                    <div className="relative z-10 text-center">
                                        <p className="text-lg font-semibold leading-relaxed text-[#17383A] md:text-xl">
                                            {post.content || " "}
                                        </p>

                                        <span className="mt-5 block text-[10px] text-[#5A928C]">
                                            {post.createdAt &&
                                            moment(post.createdAt).isValid()
                                                ? moment(
                                                      post.createdAt
                                                  ).fromNow()
                                                : ""}
                                        </span>
                                    </div>

                                    <Actions post={post} />
                                </div>
                            )}

                            {!hasImage && !isVideo && !isText && (
                                <div className="p-5 text-sm text-gray-500">
                                    This post format is not supported yet.
                                </div>
                            )}

                            <div className="flex items-center justify-between rounded-b-[26px] bg-white px-5 py-3">
                                <span className="text-[10px] text-gray-400">
                                    {getCount(post.likes)} likes
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    {getCount(post.comments)} comments
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>

            {localPosts.length === 0 && (
                <div className="rounded-3xl border border-[#D8E9E6] bg-white px-6 py-14 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5F3] text-[#347F78]">
                        <MessageCircle size={25} />
                    </div>
                    <h3 className="font-semibold text-[#17383A]">
                        No posts yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Posts will appear here when they are shared.
                    </p>
                </div>
            )}

            {editingPost && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !saving
                        ) {
                            setEditingPost(null);
                            setError("");
                        }
                    }}
                >
                    <div className="w-full max-w-lg rounded-[28px] border border-[#D8E9E6] bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#17383A]">
                                    Edit post
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update your post caption.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setEditingPost(null);
                                    setError("");
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5F3] text-[#17383A] hover:bg-[#DDF0ED] disabled:opacity-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <textarea
                            value={editContent}
                            onChange={(event) =>
                                setEditContent(event.target.value)
                            }
                            maxLength={5000}
                            rows={5}
                            placeholder="Write your caption..."
                            className="w-full resize-y rounded-2xl border border-[#D8E9E6] bg-[#F8FCFB] p-4 text-sm text-[#17383A] outline-none transition focus:border-[#5A928C] focus:ring-2 focus:ring-[#5A928C]/20"
                        />

                        <div className="mt-2 flex justify-between text-xs text-gray-400">
                            <span>Make your caption yours.</span>
                            <span>{editContent.length}/5000</span>
                        </div>

                        {error && (
                            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setEditingPost(null);
                                    setError("");
                                }}
                                className="rounded-xl border border-[#D8E9E6] px-4 py-2.5 text-sm font-semibold text-[#17383A] hover:bg-[#F3F9F8] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={saving || !editContent.trim()}
                                onClick={saveEdit}
                                className="flex items-center gap-2 rounded-xl bg-[#347F78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#286A64] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? (
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Check size={16} />
                                )}
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deletingPost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-[28px] border border-[#D8E9E6] bg-white p-6 shadow-2xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <Trash2 size={25} />
                        </div>

                        <h2 className="mt-4 text-center text-xl font-bold text-[#17383A]">
                            Delete this post?
                        </h2>

                        <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">
                            This will permanently remove the post from
                            TwixChat. This action cannot be undone.
                        </p>

                        {error && (
                            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => {
                                    setDeletingPost(null);
                                    setError("");
                                }}
                                className="flex-1 rounded-xl border border-[#D8E9E6] px-4 py-3 text-sm font-semibold text-[#17383A] hover:bg-[#F3F9F8] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={confirmDelete}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting && (
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePost;
