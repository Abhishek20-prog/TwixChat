import React, { useEffect, useState } from "react";
import {
Image,
Video,
Type,
MapPin,
X,
Send,
Sparkles,
LoaderCircle,
CheckCircle2,
AlertCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/react";
import { createPost } from "../features/posts/postslice.js";

const CreatePost = () => {
const dispatch = useDispatch();
const { getToken } = useAuth();


const [postType, setPostType] = useState("text");
const [content, setContent] = useState("");
const [location, setLocation] = useState("");
const [preview, setPreview] = useState(null);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

useEffect(() => {
    return () => {
        if (preview?.url) {
            URL.revokeObjectURL(preview.url);
        }
    };
}, [preview]);

const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        setError("Please select a valid image.");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be 10 MB or less.");
        return;
    }

    setError("");
    setSuccess("");

    setPreview({
        url: URL.createObjectURL(file),
        file,
    });
};

const removeMedia = () => {
    setPreview(null);
    setError("");
};

const handleTypeChange = (type) => {
    setPostType(type);
    setError("");
    setSuccess("");

    if (type === "text") {
        setPreview(null);
    }

    // Video publishing is not supported by the current backend.
    if (type === "video") {
        setPostType("image");
        setError(
            "Video posts are not supported yet. You can publish an image or a text post."
        );
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedContent = content.trim();

    if (postType === "text" && !trimmedContent) {
        setError("Please write something before publishing.");
        return;
    }

    if (postType === "image" && !preview?.file) {
        setError("Please select an image before publishing.");
        return;
    }

    if (preview?.file && !preview.file.type.startsWith("image/")) {
        setError("Please select a valid image.");
        return;
    }

    setSubmitting(true);

    try {
        const token = await getToken();

        if (!token) {
            throw new Error(
                "Unable to authenticate. Please sign in again."
            );
        }

        const formData = new FormData();

        formData.append("content", trimmedContent);

        const backendPostType =
            postType === "text"
                ? "text"
                : trimmedContent
                  ? "image_text"
                  : "image";

        formData.append("post_type", backendPostType);

        if (preview?.file) {
            formData.append("images", preview.file);
        }

        await dispatch(
            createPost({
                token,
                formData,
            })
        ).unwrap();

        setContent("");
        setLocation("");
        setPreview(null);
        setPostType("text");
        setSuccess("Your post has been published successfully!");

    } catch (err) {
        setError(
            typeof err === "string"
                ? err
                : err?.message || "Unable to publish your post. Please try again."
        );
    } finally {
        setSubmitting(false);
    }
};

return (
    <div className="min-h-screen bg-[#F3F7F5] px-4 py-6 sm:px-5 sm:py-8">
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-[#6B9D96]">
                    <Sparkles size={15} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Create something
                    </span>
                </div>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#183B3B] sm:text-4xl">
                    What's happening?
                </h1>

                <p className="mt-2 text-sm text-[#78908D]">
                    Turn your thoughts and moments into a post.
                </p>
            </div>

            {(error || success) && (
                <div
                    role="status"
                    className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                        error
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}
                >
                    {error ? (
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    ) : (
                        <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0"
                        />
                    )}

                    <p>{error || success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid items-start gap-5 lg:grid-cols-[1fr_280px]">
                    <div className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-[#DCE8E5] bg-white shadow-[0_15px_45px_rgba(50,80,75,0.08)] sm:min-h-[520px]">
                        {postType === "text" && (
                            <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#FAFCFB] to-[#EEF6F3] p-6 sm:p-10">
                                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D9ECE7] opacity-70" />
                                <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#E4F1EE] opacity-80" />
                                <div className="absolute left-10 top-10 h-3 w-3 rounded-full bg-[#A9CCC6] opacity-60 sm:left-16 sm:top-16" />

                                <div className="relative z-10 w-full max-w-2xl">
                                    <div className="font-serif text-7xl leading-none text-[#B4D3CE]">
                                        “
                                    </div>

                                    <textarea
                                        value={content}
                                        onChange={(e) => {
                                            setContent(e.target.value);
                                            setError("");
                                            setSuccess("");
                                        }}
                                        placeholder="Write whatever is on your mind..."
                                        maxLength={5000}
                                        className="min-h-[180px] w-full resize-none bg-transparent text-2xl font-semibold leading-tight text-[#183B3B] outline-none placeholder:text-[#AFC3C0] sm:text-4xl"
                                    />

                                    <div className="text-right font-serif text-7xl leading-none text-[#B4D3CE]">
                                        ”
                                    </div>
                                </div>
                            </div>
                        )}

                        {postType === "image" && (
                            <div className="absolute inset-0">
                                {preview ? (
                                    <>
                                        <img
                                            src={preview.url}
                                            alt="Selected post preview"
                                            className="h-full w-full object-contain bg-[#EDF4F1]"
                                        />

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-5 pt-16 sm:p-8 sm:pt-20">
                                            <textarea
                                                value={content}
                                                onChange={(e) => {
                                                    setContent(e.target.value);
                                                    setError("");
                                                    setSuccess("");
                                                }}
                                                placeholder="Say something about this..."
                                                maxLength={5000}
                                                rows={3}
                                                className="w-full resize-none bg-transparent text-lg font-semibold text-white outline-none placeholder:text-white/65 sm:text-xl"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={removeMedia}
                                            aria-label="Remove selected image"
                                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 sm:right-5 sm:top-5"
                                        >
                                            <X size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-br from-white via-[#FAFCFB] to-[#EEF6F3] p-6 transition hover:to-[#E7F2EF]">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#E0EFEB] text-[#4F8981] shadow-sm">
                                            <Image size={30} />
                                        </div>

                                        <h3 className="mt-5 text-lg font-bold text-[#183B3B]">
                                            Drop a moment here
                                        </h3>

                                        <p className="mt-1 text-center text-xs text-[#91A4A1]">
                                            Choose an image from your device
                                        </p>

                                        <span className="mt-2 text-[10px] text-[#AABBB8]">
                                            JPG, PNG, WEBP · Max 10 MB
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMediaChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[28px] border border-[#DCE8E5] bg-white p-4 shadow-[0_12px_35px_rgba(50,80,75,0.06)]">
                        <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#91A4A1]">
                            Post type
                        </p>

                        <div className="mt-3 space-y-2">
                            <button
                                type="button"
                                onClick={() => handleTypeChange("text")}
                                className={`flex w-full items-center gap-3 rounded-2xl p-3 transition-all ${
                                    postType === "text"
                                        ? "bg-[#183B3B] text-white shadow-md"
                                        : "text-[#426360] hover:bg-[#F0F7F5]"
                                }`}
                            >
                                <Type size={17} />
                                <div className="text-left">
                                    <p className="text-xs font-semibold">
                                        Thought
                                    </p>
                                    <p className={`text-[10px] ${
                                        postType === "text"
                                            ? "text-white/60"
                                            : "text-[#91A4A1]"
                                    }`}>
                                        Share what's on your mind
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTypeChange("image")}
                                className={`flex w-full items-center gap-3 rounded-2xl p-3 transition-all ${
                                    postType === "image"
                                        ? "bg-[#183B3B] text-white shadow-md"
                                        : "text-[#426360] hover:bg-[#F0F7F5]"
                                }`}
                            >
                                <Image size={17} />
                                <div className="text-left">
                                    <p className="text-xs font-semibold">
                                        Moment
                                    </p>
                                    <p className={`text-[10px] ${
                                        postType === "image"
                                            ? "text-white/60"
                                            : "text-[#91A4A1]"
                                    }`}>
                                        Share a photo
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                disabled
                                title="Video posts are not supported by the backend yet"
                                className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl p-3 text-[#A7B6B3] opacity-70"
                            >
                                <Video size={17} />
                                <div className="text-left">
                                    <p className="text-xs font-semibold">
                                        Motion
                                    </p>
                                    <p className="text-[10px]">
                                        Coming soon
                                    </p>
                                </div>
                            </button>
                        </div>

                        <div className="mt-6">
                            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#91A4A1]">
                                Details
                            </p>

                            <div className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-[#DCE8E5] bg-[#F5F9F8] px-3 transition-all focus-within:border-[#78AAA2]">
                                <MapPin
                                    size={15}
                                    className="shrink-0 text-[#5A928C]"
                                />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    placeholder="Add location"
                                    className="w-full bg-transparent text-xs text-[#183B3B] outline-none placeholder:text-[#9BAEAB]"
                                />
                            </div>

                            <p className="mt-2 px-1 text-[10px] leading-relaxed text-[#91A4A1]">
                                Location is not saved to posts by the current backend yet.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#183B3B] py-3 text-xs font-semibold text-white shadow-md shadow-[#183B3B]/10 transition-all hover:-translate-y-0.5 hover:bg-[#285757] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Send size={15} />
                                    Publish Post
                                </>
                            )}
                        </button>

                        <p className="mt-3 text-center text-[10px] text-[#91A4A1]">
                            Share something worth remembering ✨
                        </p>
                    </div>
                </div>
            </form>
        </div>
    </div>
);


};

export default CreatePost;
