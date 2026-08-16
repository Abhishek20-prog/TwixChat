import { BadgeCheck, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const STORY_DURATION = 10000;

const Storyviewer = ({ viewstory, setviewstory }) => {
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // ==========================================
  // GET USER INFORMATION
  // ==========================================

  const profileImage =
    viewstory?.user?.profile_picture ||
    viewstory?.user?.dp ||
    viewstory?.user?.avatar ||
    "";

  const userName =
    viewstory?.user?.full_name ||
    viewstory?.user?.name ||
    viewstory?.user?.username ||
    "User";

  // ==========================================
  // CLOSE STORY
  // ==========================================

  const handleClose = () => {
    setviewstory(null);
  };

  // ==========================================
  // IMAGE / TEXT STORY PROGRESS
  // ==========================================

  useEffect(() => {
    if (!viewstory) return;

    if (viewstory.media_type === "video") return;

    setProgress(0);

    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min(
        (elapsed / STORY_DURATION) * 100,
        100
      );

      setProgress(percentage);
    }, 50);

    const timer = setTimeout(() => {
      setviewstory(null);
    }, STORY_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [viewstory, setviewstory]);

  // ==========================================
  // VIDEO PROGRESS
  // ==========================================

  const handleVideoProgress = () => {
    const video = videoRef.current;

    if (!video || !video.duration) return;

    const percentage =
      (video.currentTime / video.duration) * 100;

    setProgress(percentage);
  };

  // ==========================================
  // VIDEO ENDED
  // ==========================================

  const handleVideoEnded = () => {
    setviewstory(null);
  };

  // ==========================================
  // RENDER STORY
  // ==========================================

  const renderStory = () => {
    switch (viewstory.media_type) {
      // ======================================
      // IMAGE
      // ======================================

      case "image":
        return (
          <img
            src={viewstory.media_url}
            alt="Story"
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl select-none"
            draggable="false"
          />
        );

      // ======================================
      // VIDEO
      // ======================================

      case "video":
        return (
          <video
            ref={videoRef}
            src={viewstory.media_url}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl"
            controls
            autoPlay
            playsInline
            onTimeUpdate={handleVideoProgress}
            onEnded={handleVideoEnded}
          />
        );

      // ======================================
      // TEXT
      // ======================================

      case "text":
        return (
          <div
            className="w-[min(90vw,430px)] h-[min(80vh,700px)] rounded-2xl flex items-center justify-center p-8"
            style={{
              background:
                viewstory.background_color ||
                "linear-gradient(135deg, #155E63, #F26B4D, #F9B233)",
            }}
          >
            <p className="text-white text-2xl sm:text-3xl font-bold text-center leading-relaxed break-words">
              {viewstory.content}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // ==========================================
  // IF NO STORY
  // ==========================================

  if (!viewstory) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      style={{
        background:
          viewstory.media_type === "text"
            ? viewstory.background_color
            : "#000000",
      }}
    >

      {/* ======================================
          STORY CONTAINER
      ====================================== */}

      <div className="relative w-full h-full flex items-center justify-center">

        {/* ======================================
            PROGRESS BAR
        ====================================== */}

        <div className="absolute top-3 left-4 right-4 z-[150] h-1 bg-white/25 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#58A6A6] via-[#F26B4D] to-[#F9B233]"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* ======================================
            USER INFO
        ====================================== */}

        <div className="absolute top-7 left-4 z-[150] flex items-center gap-3 px-3 py-2 rounded-xl bg-black/45 backdrop-blur-xl border border-white/10">

          {/* PROFILE IMAGE */}

          {profileImage ? (
            <img
              src={profileImage}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-white/80"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#155E63] via-[#F26B4D] to-[#F9B233] flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* USER NAME */}

          <div className="flex items-center gap-1.5">

            <span className="text-white text-sm font-semibold max-w-[180px] truncate">
              {userName}
            </span>

            <BadgeCheck
              size={17}
              className="text-[#58A6A6] fill-[#155E63]"
            />

          </div>

        </div>

        {/* ======================================
            CLOSE BUTTON
        ====================================== */}

        <button
          onClick={handleClose}
          className="absolute top-7 right-4 z-[150] w-10 h-10 rounded-full bg-black/45 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#F26B4D]/80 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <X size={23} />
        </button>

        {/* ======================================
            LEFT NAVIGATION
        ====================================== */}

        <button
          onClick={handleClose}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[140] hidden md:flex w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 items-center justify-center text-white hover:bg-[#155E63] transition-all"
        >
          <ChevronLeft size={25} />
        </button>

        {/* ======================================
            RIGHT NAVIGATION
        ====================================== */}

        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[140] hidden md:flex w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 items-center justify-center text-white hover:bg-[#F26B4D] transition-all"
        >
          <ChevronRight size={25} />
        </button>

        {/* ======================================
            STORY CONTENT
        ====================================== */}

        <div className="relative z-[100] max-w-[90vw] max-h-[85vh] flex items-center justify-center">

          {renderStory()}

        </div>

        {/* ======================================
            MOBILE PAUSE INDICATOR / DECORATION
        ====================================== */}

        {viewstory.media_type === "video" && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[150] pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/70 text-xs flex items-center gap-1.5">
              <Play size={12} fill="currentColor" />
              Playing
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Storyviewer;