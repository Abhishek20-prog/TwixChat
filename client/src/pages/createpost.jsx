
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
    Film,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/react";
import { createPost } from "../features/posts/postslice.js";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

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
        if (!preview?.url) return undefined;

        return () => URL.revokeObjectURL(preview.url);
    }, [preview]);

    const handleMediaChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        setError("");
        setSuccess("");

        if (file.size > MAX_FILE_SIZE) {
            setError(
                `File too large. Images and videos must be 100 MB or smaller. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`
            );
            return;
        }

        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
            setError("Please select a valid image or video.");
            return;
        }

        setPostType(isVideo ? "video" : "image");
        setPreview({
            url: URL.createObjectURL(file),
            file,
        });
    };

    const removeMedia = () => {
        setPreview(null);
        setError("");
        setSuccess("");
    };

    const handleTypeChange = (type) => {
        if (type !== postType) {
            setPreview(null);
        }

        setPostType(type);
        setError("");
        setSuccess("");
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

        if (
            (postType === "image" || postType === "video") &&
            !preview?.file
        ) {
            setError(
                `Please select ${postType === "video" ? "a video" : "an image"} before publishing.`
            );
            return;
        }

        if (preview?.file && preview.file.size > MAX_FILE_SIZE) {
            setError("Images and videos must be 100 MB or smaller.");
            return;
        }

        if (
            preview?.file &&
            !preview.file.type.startsWith(
                postType === "video" ? "video/" : "image/"
            )
        ) {
            setError(`Please select a valid ${postType}.`);
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
                postType === "video"
                    ? trimmedContent
                        ? "video_text"
                        : "video"
                    : postType === "image"
                      ? trimmedContent
                          ? "image_text"
                          : "image"
                      : "text";

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
                    : err?.message ||
                      "Unable to publish your post. Please try again."
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
                        role={error ? "alert" : "status"}
                        className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                            error
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-800"
                        }`}
                    >
                        {error ? (
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
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

                            {(postType === "image" || postType === "video") && (
                                <div className="absolute inset-0 flex flex-col bg-[#EDF4F1]">
                                    {preview ? (
                                        <>
                                            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#102A2A]">
                                                {postType === "video" ? (
                                                    <video
                                                        key={preview.url}
                                                        src={preview.url}
                                                        controls
                                                        playsInline
                                                        preload="metadata"
                                                        className="max-h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <img
                                                        src={preview.url}
                                                        alt="Selected post preview"
                                                        className="max-h-full w-full object-contain"
                                                    />
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={removeMedia}
                                                    aria-label={`Remove selected ${postType}`}
                                                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            <div className="shrink-0 border-t border-[#DCE8E5] bg-white p-4 sm:p-6">
                                                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#5A928C]">
                                                    {postType === "video" ? (
                                                        <Film size={15} />
                                                    ) : (
                                                        <Image size={15} />
                                                    )}
                                                    {postType === "video"
                                                        ? "Your motion, your moment"
                                                        : "Your selected moment"}
                                                </div>

                                                <p className="mb-3 text-[11px] text-[#78908D]">
                                                    Maximum file size: 100 MB.
                                                </p>

                                                <textarea
                                                    value={content}
                                                    onChange={(e) => {
                                                        setContent(e.target.value);
                                                        setError("");
                                                        setSuccess("");
                                                    }}
                                                    placeholder={
                                                        postType === "video"
                                                            ? "Add a caption to your video..."
                                                            : "Say something about this..."
                                                    }
                                                    maxLength={5000}
                                                    rows={3}
                                                    className="w-full resize-none bg-transparent text-base font-medium text-[#183B3B] outline-none placeholder:text-[#A1B5B1] sm:text-lg"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-br from-white via-[#FAFCFB] to-[#EEF6F3] p-6 transition hover:to-[#E7F2EF]">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#E0EFEB] text-[#4F8981] shadow-sm transition duration-300 hover:scale-105">
                                                {postType === "video" ? (
                                                    <Video size={30} />
                                                ) : (
                                                    <Image size={30} />
                                                )}
                                            </div>

                                            <h3 className="mt-5 text-lg font-bold text-[#183B3B]">
                                                {postType === "video"
                                                    ? "Bring your moment to life"
                                                    : "Drop a moment here"}
                                            </h3>

                                            <p className="mt-1 text-center text-xs text-[#91A4A1]">
                                                {postType === "video"
                                                    ? "Choose a video from your device"
                                                    : "Choose an image from your device"}
                                            </p>

                                            <span className="mt-2 text-[10px] text-[#AABBB8]">
                                                {postType === "video"
                                                    ? "MP4, WebM, MOV · Maximum 100 MB"
                                                    : "JPG, PNG, WEBP, GIF · Maximum 100 MB"}
                                            </span>

                                            <input
                                                type="file"
                                                accept={
                                                    postType === "video"
                                                        ? "video/*"
                                                        : "image/*"
                                                }
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
                                        <p className="text-xs font-semibold">Thought</p>
                                        <p className={`text-[10px] ${postType === "text" ? "text-white/60" : "text-[#91A4A1]"}`}>
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
                                        <p className="text-xs font-semibold">Moment</p>
                                        <p className={`text-[10px] ${postType === "image" ? "text-white/60" : "text-[#91A4A1]"}`}>
                                            Share a photo
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleTypeChange("video")}
                                    className={`flex w-full items-center gap-3 rounded-2xl p-3 transition-all ${
                                        postType === "video"
                                            ? "bg-[#183B3B] text-white shadow-md"
                                            : "text-[#426360] hover:bg-[#F0F7F5]"
                                    }`}
                                >
                                    <Video size={17} />
                                    <div className="text-left">
                                        <p className="text-xs font-semibold">Motion</p>
                                        <p className={`text-[10px] ${postType === "video" ? "text-white/60" : "text-[#91A4A1]"}`}>
                                            Share a video
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-6">
                                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#91A4A1]">
                                    Details
                                </p>

                                <div className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-[#DCE8E5] bg-[#F5F9F8] px-3 transition-all focus-within:border-[#78AAA2]">
                                    <MapPin size={15} className="shrink-0 text-[#5A928C]" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Add location"
                                        className="w-full bg-transparent text-xs text-[#183B3B] outline-none placeholder:text-[#9BAEAB]"
                                    />
                                </div>

                                <p className="mt-2 px-1 text-[10px] leading-relaxed text-[#91A4A1]">
                                    Location is not saved to posts by the current backend yet.
                                </p>

                                <p className="mt-3 px-1 text-[11px] leading-relaxed text-[#78908D]">
                                    <AlertCircle size={13} className="mr-1 inline-block" />
                                    Images and videos must be 100 MB or smaller.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#183B3B] py-3 text-xs font-semibold text-white shadow-md shadow-[#183B3B]/10 transition-all hover:-translate-y-0.5 hover:bg-[#285757] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle size={15} className="animate-spin" />
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
