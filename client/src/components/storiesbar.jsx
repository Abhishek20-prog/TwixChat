import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import moment from "moment";

import Storycreate from "./storycreate";
import Storyviewer from "./storyviewer";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
const CARDS_PER_PAGE = 5;

const StoriesBar = () => {
  const { getToken } = useAuth();

  const [stories, setStories] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showmodal, setshowmodal] = useState(false);
  const [viewstory, setviewstory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchstories = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Please sign in to view stories.");
      }

      const response = await fetch(`${API_URL}/api/story/feed`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load stories.");
      }

      const formattedStories = (data.stories || [])
        .map((story) => {
          const user = story.userId || {};
          const mediaUrl = Array.isArray(story.media_url)
            ? story.media_url[0] || ""
            : story.media_url || "";

          let type = story.story_type;

          if (type === "image_text") {
            type = mediaUrl ? "image" : "text";
          }

          if (!["image", "video", "text"].includes(type)) {
            return null;
          }

          if ((type === "image" || type === "video") && !mediaUrl) {
            return null;
          }

          return {
            id: String(story._id),
            _id: String(story._id),
            createdAt: story.createdAt,
            viewed: false,
            media_type: type,
            media_url: mediaUrl,
            content: story.content || "",
            background_color: story.background_color || "",
            user: {
              _id: String(user._id || user.clerkId || ""),
              name: user.full_name || user.username || "User",
              full_name: user.full_name || user.username || "User",
              username: user.username || "",
              dp: user.profile_picture || "",
              profile_picture: user.profile_picture || "",
            },
          };
        })
        .filter(Boolean);

      setStories(formattedStories);

      setStartIndex(0);

      setviewstory((current) => {
        if (!current) return null;

        const stillExists = formattedStories.find(
          (story) => story.id === String(current.id || current._id),
        );

        return stillExists || null;
      });
    } catch (error) {
      console.error("Fetch stories error:", error);
      toast.error(error.message || "Could not load stories.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchstories();
  }, [fetchstories]);

  // Group stories by user so each user gets one card.
  const groupedStories = useMemo(() => {
    const groups = new Map();

    stories.forEach((story) => {
      const userKey = story.user._id || story.user.username;

      if (!userKey) return;

      if (!groups.has(userKey)) {
        groups.set(userKey, {
          userKey,
          user: story.user,
          stories: [],
        });
      }

      groups.get(userKey).stories.push(story);
    });

    return Array.from(groups.values()).map((group) => ({
      ...group,
      stories: [...group.stories].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    }));
  }, [stories]);

  // Viewer navigation uses normalized individual stories, not user cards.
  const viewerStories = useMemo(
    () => groupedStories.flatMap((group) => group.stories),
    [groupedStories],
  );

  const handleNext = () => {
    if (startIndex + CARDS_PER_PAGE < groupedStories.length) {
      setDirection(1);
      setStartIndex((prev) => prev + CARDS_PER_PAGE);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setDirection(-1);
      setStartIndex((prev) => Math.max(0, prev - CARDS_PER_PAGE));
    }
  };

  const handleStoryClick = (group) => {
    // Start with this user's oldest story, then move through their stories.
    const firstStory = group.stories[0];

    if (firstStory) {
      setviewstory(firstStory);
    }
  };

  const visibleGroups = groupedStories.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE,
  );

  return (
    <div className="relative w-full">
      <div className="overflow-hidden px-1 py-3">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={startIndex}
            custom={direction}
            initial={{
              x: direction > 0 ? 450 : -450,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x: direction > 0 ? -450 : 450,
              opacity: 0,
            }}
            transition={{
              x: {
                type: "spring",
                stiffness: 280,
                damping: 28,
              },
              opacity: { duration: 0.2 },
            }}
            className="flex gap-4"
          >
            {startIndex === 0 && (
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setshowmodal(true)}
                className="group relative h-[190px] w-[145px] shrink-0 cursor-pointer"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[32px] border-2 border-dashed border-[#B8CDCA] bg-[#F8FCFB] shadow-sm transition-all duration-300 group-hover:border-[#155E63] group-hover:bg-[#F1F9F7] group-hover:shadow-md">
                  <div className="absolute right-0 top-0 h-12 w-12 rounded-bl-[28px] bg-[#F26B4D]/10" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#155E63] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F26B4D]">
                      <Plus size={27} strokeWidth={2} className="text-white" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#17383A] transition-colors group-hover:text-[#155E63]">
                      Create Story
                    </p>

                    <p className="mt-1 text-[10px] text-[#819493]">
                      Share your moment
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {visibleGroups.map((group) => {
              // Use the latest story as the card preview.
              const preview = group.stories[group.stories.length - 1];

              return (
                <motion.div
                  key={group.userKey}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="group relative h-[190px] w-[145px] shrink-0 cursor-pointer"
                  onClick={() => handleStoryClick(group)}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-[#155E63] bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg">
                    {preview.media_type === "video" ? (
                      <video
                        src={preview.media_url}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        muted
                        loop
                        playsInline
                      />
                    ) : preview.media_type === "text" ? (
                      <div
                        className="absolute inset-0 flex items-center justify-center p-5"
                        style={{
                          background:
                            preview.background_color ||
                            "linear-gradient(135deg, #155E63, #F26B4D)",
                        }}
                      >
                        <p className="line-clamp-5 text-center text-sm font-semibold text-white">
                          {preview.content}
                        </p>
                      </div>
                    ) : (
                      <img
                        src={preview.media_url}
                        alt={group.user.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    <div className="absolute right-0 top-0 z-10 h-12 w-12 rounded-bl-[28px] bg-[#F26B4D]/80" />

                    <div className="absolute left-3 top-3 z-10 h-11 w-11 rounded-full bg-gradient-to-br from-[#F9B233] via-[#F26B4D] to-[#155E63] p-[2px]">
                      <div className="h-full w-full rounded-full bg-white p-[2px]">
                        {group.user.dp ? (
                          <img
                            src={group.user.dp}
                            alt={group.user.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#155E63] text-sm font-bold text-white">
                            {group.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute right-4 top-4 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
                      {preview.media_type === "video" ? (
                        <span className="text-[9px] text-[#155E63]">▶</span>
                      ) : preview.media_type === "text" ? (
                        <span className="text-[11px] font-bold text-[#155E63]">
                          T
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#F26B4D]">✦</span>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                      <p className="truncate text-sm font-semibold text-white">
                        {group.user.name}
                      </p>

                      <p className="mt-1 text-[10px] text-white/80">
                        {group.stories.length}{" "}
                        {group.stories.length === 1 ? "story" : "stories"}
                        {" · "}
                        {moment(preview.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {!loading && groupedStories.length === 0 && startIndex === 0 && (
              <div className="flex h-[190px] min-w-[145px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#B8CDCA] bg-[#F8FCFB] px-4 text-center">
                <span className="text-2xl">✨</span>
                <p className="mt-2 text-xs font-semibold text-[#155E63]">
                  No stories yet
                </p>
                <p className="mt-1 text-[10px] text-[#819493]">
                  Be the first to share a moment
                </p>
              </div>
            )}

            {loading && startIndex === 0 && (
              <div className="flex h-[190px] items-center px-4 text-sm text-[#819493]">
                Loading stories...
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {startIndex > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevious}
          aria-label="Previous story cards"
          className="absolute left-[-12px] top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8E2D8] bg-white text-[#155E63] shadow-md transition-colors hover:bg-[#155E63] hover:text-white"
        >
          <ChevronLeft size={20} />
        </motion.button>
      )}

      {startIndex + CARDS_PER_PAGE < groupedStories.length && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          aria-label="Next story cards"
          className="absolute right-[-12px] top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8E2D8] bg-white text-[#155E63] shadow-md transition-colors hover:bg-[#155E63] hover:text-white"
        >
          <ChevronRight size={20} />
        </motion.button>
      )}

      {showmodal && (
        <Storycreate setshowmodal={setshowmodal} fetchstories={fetchstories} />
      )}

      {viewstory && (
        <Storyviewer
          viewstory={viewstory}
          setviewstory={setviewstory}
          stories={viewerStories}
        />
      )}
    </div>
  );
};

export default StoriesBar;
