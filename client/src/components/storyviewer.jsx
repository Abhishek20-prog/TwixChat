
import { BadgeCheck, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORY_DURATION = 10000;

const Storyviewer = ({
    viewstory,
    setviewstory,
    stories = [],
}) => {
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);

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

    const getStoryIndex = useCallback(() => {
        if (!viewstory) return -1;

        return stories.findIndex((story) => {
            if (story === viewstory) return true;

            const currentId = viewstory._id || viewstory.id;
            const storyId = story._id || story.id;

            return Boolean(
                currentId && storyId && String(currentId) === String(storyId)
            );
        });
    }, [stories, viewstory]);

    const currentIndex = getStoryIndex();

    const getUserId = useCallback((story) => {
        return (
            story?.user?._id ||
            story?.user?.clerkId ||
            story?.user?.username ||
            story?.userId?._id ||
            story?.userId ||
            null
        );
    }, []);

    const currentUserStories = useMemo(() => {
        if (!viewstory) return [];

        const currentUserId = getUserId(viewstory);

        if (!currentUserId) return [viewstory];

        const matchingStories = stories.filter((story) => {
            const storyUserId = getUserId(story);

            return (
                storyUserId &&
                String(storyUserId) === String(currentUserId)
            );
        });

        return matchingStories.length ? matchingStories : [viewstory];
    }, [stories, viewstory, getUserId]);

    const currentUserStoryIndex = currentUserStories.findIndex((story) => {
        const currentId = viewstory?._id || viewstory?.id;
        const storyId = story?._id || story?.id;

        return (
            currentId &&
            storyId &&
            String(currentId) === String(storyId)
        );
    });

    const handleClose = useCallback(() => {
        setviewstory(null);
    }, [setviewstory]);

    const navigateStory = useCallback(
        (direction) => {
            if (!viewstory || !stories.length) return;

            const index = getStoryIndex();

            if (index === -1) {
                handleClose();
                return;
            }

            const nextIndex = index + direction;

            if (nextIndex < 0) {
                setviewstory(stories[0] || null);
                return;
            }

            if (nextIndex >= stories.length) {
                handleClose();
                return;
            }

            setviewstory(stories[nextIndex]);
        },
        [viewstory, stories, getStoryIndex, setviewstory, handleClose]
    );

    const handlePrevious = useCallback(() => {
        navigateStory(-1);
    }, [navigateStory]);

    const handleNext = useCallback(() => {
        navigateStory(1);
    }, [navigateStory]);

    useEffect(() => {
        if (!viewstory) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") handleClose();
            if (event.key === "ArrowLeft") handlePrevious();
            if (event.key === "ArrowRight") handleNext();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [viewstory, handleClose, handlePrevious, handleNext]);

    useEffect(() => {
        if (!viewstory) return;

        setProgress(0);

        if (viewstory.media_type === "video") return;

        const startTime = Date.now();

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setProgress(Math.min((elapsed / STORY_DURATION) * 100, 100));
        }, 50);

        const timer = setTimeout(() => {
            navigateStory(1);
        }, STORY_DURATION);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timer);
        };
    }, [viewstory, navigateStory]);

    const handleVideoProgress = () => {
        const video = videoRef.current;

        if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
            return;
        }

        setProgress(
            Math.min((video.currentTime / video.duration) * 100, 100)
        );
    };

    const handleVideoEnded = () => {
        navigateStory(1);
    };

    if (!viewstory) return null;

    const renderStory = () => {
        switch (viewstory.media_type) {
            case "image":
                return viewstory.media_url ? (
                    <img
                        key={viewstory._id || viewstory.id || viewstory.media_url}
                        src={viewstory.media_url}
                        alt="Story"
                        className="max-h-[85vh] max-w-full h-auto w-auto rounded-xl object-contain select-none"
                        draggable="false"
                    />
                ) : (
                    <div className="rounded-xl bg-[#17383A] p-8 text-center text-white">
                        Image unavailable
                    </div>
                );

            case "video":
                return viewstory.media_url ? (
                    <video
                        key={viewstory._id || viewstory.id || viewstory.media_url}
                        ref={videoRef}
                        src={viewstory.media_url}
                        className="max-h-[85vh] max-w-full h-auto w-auto rounded-xl object-contain"
                        controls
                        autoPlay
                        playsInline
                        onTimeUpdate={handleVideoProgress}
                        onEnded={handleVideoEnded}
                    />
                ) : (
                    <div className="rounded-xl bg-[#17383A] p-8 text-center text-white">
                        Video unavailable
                    </div>
                );

            case "text":
                return (
                    <div
                        className="flex h-[min(80vh,700px)] w-[min(90vw,430px)] items-center justify-center rounded-2xl p-8"
                        style={{
                            background:
                                viewstory.background_color ||
                                "linear-gradient(135deg, #155E63, #F26B4D, #F9B233)",
                        }}
                    >
                        <p className="break-words text-center text-2xl font-bold leading-relaxed text-white sm:text-3xl">
                            {viewstory.content}
                        </p>
                    </div>
                );

            default:
                return (
                    <div className="rounded-xl bg-[#17383A] px-8 py-10 text-center text-white">
                        <p className="font-semibold">
                            This story cannot be displayed.
                        </p>
                        <p className="mt-2 text-sm text-white/70">
                            Try moving to the next story.
                        </p>
                    </div>
                );
        }
    };

    const hasStoryList = currentIndex !== -1 && stories.length > 0;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            style={{
                background:
                    viewstory.media_type === "text"
                        ? viewstory.background_color ||
                          "linear-gradient(135deg, #155E63, #F26B4D, #F9B233)"
                        : "#000000",
            }}
        >
            <div className="relative flex h-full w-full items-center justify-center">
                {/* Progress segments for this user's stories only */}
                <div className="absolute left-4 right-4 top-3 z-[150] flex gap-1">
                    {currentUserStories.map((story, index) => {
                        const isCompleted = index < currentUserStoryIndex;
                        const isActive = index === currentUserStoryIndex;

                        return (
                            <div
                                key={story._id || story.id || index}
                                className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/30"
                            >
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#58A6A6] via-[#F26B4D] to-[#F9B233]"
                                    style={{
                                        width: isCompleted
                                            ? "100%"
                                            : isActive
                                              ? `${progress}%`
                                              : "0%",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="absolute left-4 top-7 z-[150] flex items-center gap-3 rounded-xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-xl">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={userName}
                            className="h-9 w-9 rounded-full border-2 border-white/80 object-cover"
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#155E63] via-[#F26B4D] to-[#F9B233] font-bold text-white">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
                        <span className="max-w-[180px] truncate text-sm font-semibold text-white">
                            {userName}
                        </span>
                        <BadgeCheck
                            size={17}
                            className="fill-[#155E63] text-[#58A6A6]"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close story"
                    className="absolute right-4 top-7 z-[150] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-[#F26B4D]/80"
                >
                    <X size={23} />
                </button>

                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={!hasStoryList || currentIndex <= 0}
                    aria-label="Previous story"
                    className="absolute left-4 top-1/2 z-[140] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all hover:bg-[#155E63] disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                >
                    <ChevronLeft size={25} />
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasStoryList}
                    aria-label="Next story"
                    className="absolute right-4 top-1/2 z-[140] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all hover:bg-[#F26B4D] disabled:cursor-not-allowed disabled:opacity-30 md:flex"
                >
                    <ChevronRight size={25} />
                </button>

                <div className="relative z-[100] flex max-h-[85vh] max-w-[90vw] items-center justify-center">
                    {renderStory()}
                </div>

                {viewstory.media_type === "video" && (
                    <div className="pointer-events-none absolute bottom-6 left-1/2 z-[150] -translate-x-1/2">
                        <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
                            <Play size={12} fill="currentColor" />
                            Playing
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={!hasStoryList || currentIndex <= 0}
                    aria-label="Previous story"
                    className="absolute bottom-5 left-5 z-[150] rounded-full bg-black/40 px-4 py-2 text-sm text-white disabled:opacity-30 md:hidden"
                >
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasStoryList}
                    aria-label="Next story"
                    className="absolute bottom-5 right-5 z-[150] rounded-full bg-[#155E63]/90 px-4 py-2 text-sm font-semibold text-white disabled:opacity-30 md:hidden"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Storyviewer;
