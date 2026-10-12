
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Type as TextIcon,
  Upload as UploadIcon,
  X,
  Image as ImageIcon,
  Video,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_BASE_URL || "";

const gradients = [
  "linear-gradient(135deg, #155E63, #F26B4D)",
  "linear-gradient(135deg, #F26B4D, #F9B233)",
  "linear-gradient(135deg, #155E63, #0F3D40)",
  "linear-gradient(135deg, #6D5BBA, #C77DCC)",
  "linear-gradient(135deg, #2193B0, #6DD5ED)",
  "linear-gradient(135deg, #FF512F, #DD2476)",
  "linear-gradient(135deg, #134E5E, #71B280)",
  "linear-gradient(135deg, #42275A, #734B6D)",
  "linear-gradient(135deg, #F7971E, #FFD200)",
  "linear-gradient(135deg, #232526, #414345)",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const Storycreate = ({ setshowmodal, fetchstories }) => {
  const { getToken } = useAuth();

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(gradients[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!media) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(media);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [media]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isUploading) {
        setshowmodal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isUploading, setshowmodal]);

  const handleMediaUpload = (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/")
    ) {
      toast.error("Please select an image or video.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be 100 MB or less.");
      return;
    }

    setMedia(file);
    setMode("media");
  };

  const handleCreateStory = async () => {
    if (isUploading) return;

    if (mode === "text" && !text.trim()) {
      toast.error("Please write something for your story.");
      return;
    }

    if (mode === "media" && !media) {
      toast.error("Please select an image or video.");
      return;
    }

    setIsUploading(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication required. Please sign in again.");
      }

      const formData = new FormData();

      const storyType =
        mode === "text"
          ? "text"
          : media.type.startsWith("video/")
            ? "video"
            : "image";

      formData.append("story_type", storyType);
      formData.append("content", mode === "text" ? text.trim() : "");
      formData.append(
        "background_color",
        mode === "text" ? background : ""
      );

      if (mode === "media" && media) {
        formData.append("file", media);
      }

      const response = await fetch(`${API_URL}/api/story/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            `Could not create story. Server returned ${response.status}.`
        );
      }

      toast.success("Story added successfully!");

      if (typeof fetchstories === "function") {
        await fetchstories();
      }

      setshowmodal(false);
    } catch (error) {
      console.error("Create story error:", error);
      toast.error(error.message || "Failed to create story.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#102D2F]/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUploading) {
          setshowmodal(false);
        }
      }}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-[#F8FCFB] shadow-2xl md:flex-row">
        {/* Left panel */}
        <div className="flex flex-1 flex-col p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setshowmodal(false)}
              disabled={isUploading}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#155E63] transition hover:bg-[#E8F5F3] disabled:opacity-50"
              aria-label="Go back"
            >
              <ArrowLeft size={21} />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-[#F26B4D]" />
              <h2 className="text-lg font-bold text-[#17383A]">
                Create Story
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setshowmodal(false)}
              disabled={isUploading}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#819493] transition hover:bg-[#FCEAE5] hover:text-[#F26B4D] disabled:opacity-50"
              aria-label="Close"
            >
              <X size={21} />
            </button>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-2xl bg-[#E8F5F3] p-1">
            <button
              type="button"
              onClick={() => setMode("text")}
              disabled={isUploading}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                mode === "text"
                  ? "bg-white text-[#155E63] shadow-sm"
                  : "text-[#819493] hover:text-[#155E63]"
              }`}
            >
              <TextIcon size={17} />
              Text Story
            </button>

            <button
              type="button"
              onClick={() => setMode("media")}
              disabled={isUploading}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                mode === "media"
                  ? "bg-white text-[#155E63] shadow-sm"
                  : "text-[#819493] hover:text-[#155E63]"
              }`}
            >
              <UploadIcon size={17} />
              Photo / Video
            </button>
          </div>

          {mode === "text" ? (
            <div className="flex flex-1 flex-col">
              <label className="mb-2 text-sm font-semibold text-[#17383A]">
                What's on your mind?
              </label>

              <textarea
                value={text}
                onChange={(event) =>
                  setText(event.target.value.slice(0, 500))
                }
                maxLength={500}
                placeholder="Share a thought with your connections..."
                disabled={isUploading}
                className="min-h-[140px] flex-1 resize-none rounded-2xl border border-[#D8E7E4] bg-white p-4 text-sm leading-6 text-[#17383A] outline-none transition placeholder:text-[#A4B5B2] focus:border-[#155E63] focus:ring-2 focus:ring-[#155E63]/10 disabled:opacity-60"
              />

              <div className="mt-2 text-right text-xs text-[#819493]">
                {text.length}/500
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-[#17383A]">
                  Choose a background
                </p>

                <div className="grid grid-cols-5 gap-3">
                  {gradients.map((gradient, index) => (
                    <button
                      key={gradient}
                      type="button"
                      disabled={isUploading}
                      onClick={() => setBackground(gradient)}
                      aria-label={`Background ${index + 1}`}
                      className={`relative h-12 rounded-xl transition hover:scale-105 disabled:opacity-60 ${
                        background === gradient
                          ? "ring-2 ring-[#155E63] ring-offset-2"
                          : ""
                      }`}
                      style={{ background: gradient }}
                    >
                      {background === gradient && (
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <p className="mb-3 text-sm font-semibold text-[#17383A]">
                Upload a photo or video
              </p>

              <label
                className={`flex min-h-[210px] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#B8CDCA] bg-white p-6 text-center transition hover:border-[#155E63] hover:bg-[#F1F9F7] ${
                  isUploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5F3] text-[#155E63]">
                  <UploadIcon size={25} />
                </div>

                <p className="text-sm font-semibold text-[#17383A]">
                  Click to select a file
                </p>

                <p className="mt-2 text-xs text-[#819493]">
                  Images and videos up to 100 MB
                </p>

                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleMediaUpload}
                />
              </label>

              {media && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#D8E7E4] bg-white p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F5F3] text-[#155E63]">
                    {media.type.startsWith("video/") ? (
                      <Video size={20} />
                    ) : (
                      <ImageIcon size={20} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#17383A]">
                      {media.name}
                    </p>
                    <p className="text-xs text-[#819493]">
                      {(media.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMedia(null)}
                    disabled={isUploading}
                    className="rounded-full p-2 text-[#819493] hover:bg-[#FCEAE5] hover:text-[#F26B4D]"
                    aria-label="Remove selected file"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleCreateStory}
            disabled={isUploading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#155E63] px-5 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#104B4F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUploading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Uploading Story...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Create Story
              </>
            )}
          </button>
        </div>

        {/* Right-side preview */}
        <div className="hidden w-[340px] flex-col items-center justify-center bg-[#E8F5F3] p-8 md:flex">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#819493]">
            Story Preview
          </p>

          <div
            className="relative flex h-[440px] w-[250px] items-center justify-center overflow-hidden rounded-[30px] bg-white shadow-xl"
            style={{
              background:
                mode === "text"
                  ? background
                  : "#17383A",
            }}
          >
            {mode === "text" ? (
              <p className="whitespace-pre-wrap break-words px-6 text-center text-lg font-semibold text-white">
                {text || "Your story will appear here..."}
              </p>
            ) : previewUrl ? (
              media?.type.startsWith("video/") ? (
                <video
                  src={previewUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Story preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )
            ) : (
              <div className="flex flex-col items-center px-6 text-center text-white">
                <UploadIcon size={35} />
                <p className="mt-4 text-sm font-semibold">
                  Your photo or video
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Select a file to preview it
                </p>
              </div>
            )}

            <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80 bg-[#155E63] text-sm font-bold text-white">
                T
              </div>
              <span className="text-xs font-semibold text-white drop-shadow">
                Your story
              </span>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[#819493]">
            Share a moment with your TwixChat connections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Storycreate;
