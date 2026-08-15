import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import dummyStories from "../data/dummystories";
import moment from "moment";
import Storycreate from "./storycreate";
import Storyviewer from "./storyviewer";

const StoriesBar = () => {
  const [stories, setStories] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showmodal, setshowmodal] = useState(false);
  const [viewstory , setviewstory]=useState(false)

  const CARDS_PER_PAGE = 5;

  // =========================
  // LOAD STORIES
  // =========================

  useEffect(() => {
    setStories(dummyStories);
  }, []);

  // =========================
  // REFRESH STORIES
  // =========================

  const fetchstories = () => {
    setStories([...dummyStories]);
  };

  // =========================
  // NEXT
  // =========================

  const handleNext = () => {
    if (
      startIndex + CARDS_PER_PAGE <
      stories.length
    ) {
      setDirection(1);

      setStartIndex(
        (prev) => prev + CARDS_PER_PAGE
      );
    }
  };

  // =========================
  // PREVIOUS
  // =========================

  const handlePrevious = () => {
    if (startIndex > 0) {
      setDirection(-1);

      setStartIndex(
        (prev) => prev - CARDS_PER_PAGE
      );
    }
  };

  const visibleStories = stories.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  return (
    <div className="relative w-full">

      {/* ================================= */}
      {/* STORIES VIEWPORT */}
      {/* ================================= */}

      <div className="overflow-hidden px-1 py-3">

        <AnimatePresence
          mode="popLayout"
          initial={false}
          custom={direction}
        >

          <motion.div
            key={startIndex}
            custom={direction}
            initial={{
              x:
                direction > 0
                  ? 450
                  : -450,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x:
                direction > 0
                  ? -450
                  : 450,
              opacity: 0,
            }}
            transition={{
              x: {
                type: "spring",
                stiffness: 280,
                damping: 28,
              },
              opacity: {
                duration: 0.2,
              },
            }}
            className="flex gap-4"
          >

            {/* ================================= */}
            {/* CREATE STORY CARD */}
            {/* ================================= */}

            {startIndex === 0 && (
              <motion.div
                whileHover={{
                  y: -5,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  setshowmodal(true)
                }
                className="
                  group
                  relative
                  w-[145px]
                  h-[190px]
                  shrink-0
                  cursor-pointer
                "
              >

                <div
                  className="
                    relative
                    w-full
                    h-full
                    overflow-hidden
                    rounded-[32px]
                    border-2
                    border-dashed
                    border-[#B8CDCA]
                    bg-[#F8FCFB]
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:border-[#155E63]
                    group-hover:bg-[#F1F9F7]
                    group-hover:shadow-md
                  "
                >

                  {/* Decorative Corner */}

                  <div
                    className="
                      absolute
                      top-0
                      right-0
                      w-12
                      h-12
                      bg-[#F26B4D]/10
                      rounded-bl-[28px]
                    "
                  />

                  {/* Plus */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >

                    <div
                      className="
                        w-14
                        h-14
                        rounded-full
                        bg-[#155E63]
                        flex
                        items-center
                        justify-center
                        shadow-md
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:bg-[#F26B4D]
                      "
                    >

                      <Plus
                        size={27}
                        strokeWidth={2}
                        className="text-white"
                      />

                    </div>

                    <p
                      className="
                        mt-4
                        text-sm
                        font-semibold
                        text-[#17383A]
                        group-hover:text-[#155E63]
                        transition-colors
                      "
                    >
                      Create Story
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-[#819493]
                      "
                    >
                      Share your moment
                    </p>

                  </div>

                </div>

              </motion.div>
            )}

            {/* ================================= */}
            {/* STORY CARDS */}
            {/* ================================= */}

            {visibleStories.map((story) => (

              <motion.div
                key={story.id}
                whileHover={{
                  y: -5,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  group
                  relative
                  w-[145px]
                  h-[190px]
                  shrink-0
                  cursor-pointer
                "
                onClick={()=>{
                    setviewstory(story)
                }}
              >

                <div
                  className={`
                    relative
                    w-full
                    h-full
                    overflow-hidden
                    rounded-[32px]
                    bg-white
                    border
                    ${
                      story.viewed
                        ? "border-[#E8E2D8]"
                        : "border-[#155E63]"
                    }
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:shadow-lg
                  `}
                >

                  {/* MEDIA */}

                  {story.story.type ===
                  "video" ? (
                    <video
                      src={
                        story.story.media
                      }
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={
                        story.story.media
                      }
                      alt={
                        story.user.name
                      }
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  )}

                  {/* GRADIENT */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/75
                      via-black/15
                      to-transparent
                    "
                  />

                  {/* CORNER */}

                  <div
                    className="
                      absolute
                      top-0
                      right-0
                      w-12
                      h-12
                      bg-[#F26B4D]/80
                      rounded-bl-[28px]
                      z-10
                    "
                  />

                  {/* PROFILE */}

                  <div
                    className={`
                      absolute
                      top-3
                      left-3
                      w-11
                      h-11
                      p-[2px]
                      rounded-full
                      z-10
                      ${
                        story.viewed
                          ? "bg-[#C9D2D0]"
                          : "bg-gradient-to-br from-[#F9B233] via-[#F26B4D] to-[#155E63]"
                      }
                    `}
                  >

                    <div
                      className="
                        w-full
                        h-full
                        rounded-full
                        bg-white
                        p-[2px]
                      "
                    >

                      <img
                        src={
                          story.user.dp
                        }
                        alt={
                          story.user.name
                        }
                        className="
                          w-full
                          h-full
                          object-cover
                          rounded-full
                        "
                      />

                    </div>

                  </div>

                  {/* STORY TYPE */}

                  <div
                    className="
                      absolute
                      top-4
                      right-4
                      z-20
                      w-6
                      h-6
                      rounded-full
                      bg-white/90
                      backdrop-blur-sm
                      flex
                      items-center
                      justify-center
                      shadow-sm
                    "
                  >

                    {story.story.type ===
                    "video" ? (
                      <span className="text-[9px] text-[#155E63]">
                        ▶
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#F26B4D]">
                        ✦
                      </span>
                    )}

                  </div>

                  {/* USER INFO */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      p-4
                      z-10
                    "
                  >

                    <p
                      className="
                        text-white
                        text-sm
                        font-semibold
                        truncate
                      "
                    >
                      {story.user.name}
                    </p>

                    <p
                      className="
                        text-white/70
                        text-[10px]
                        mt-1
                      "
                    >
                      {moment(
                        story.createdAt
                      ).fromNow()}
                    </p>

                  </div>

                </div>

              </motion.div>

            ))}

          </motion.div>

        </AnimatePresence>

      </div>

      {/* ================================= */}
      {/* PREVIOUS */}
      {/* ================================= */}

      {startIndex > 0 && (
        <motion.button
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{
            scale: 0.9,
          }}
          onClick={handlePrevious}
          className="
            absolute
            left-[-12px]
            top-1/2
            -translate-y-1/2
            z-30
            w-9
            h-9
            rounded-full
            bg-white
            border
            border-[#E8E2D8]
            shadow-md
            flex
            items-center
            justify-center
            text-[#155E63]
            hover:bg-[#155E63]
            hover:text-white
            transition-colors
          "
        >
          <ChevronLeft size={20} />
        </motion.button>
      )}

      {/* ================================= */}
      {/* NEXT */}
      {/* ================================= */}

      {startIndex +
        CARDS_PER_PAGE <
        stories.length && (
        <motion.button
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{
            scale: 0.9,
          }}
          onClick={handleNext}
          className="
            absolute
            right-[-12px]
            top-1/2
            -translate-y-1/2
            z-30
            w-9
            h-9
            rounded-full
            bg-white
            border
            border-[#E8E2D8]
            shadow-md
            flex
            items-center
            justify-center
            text-[#155E63]
            hover:bg-[#155E63]
            hover:text-white
            transition-colors
          "
        >
          <ChevronRight size={20} />
        </motion.button>
      )}

      {/* ================================= */}
      {/* CREATE STORY MODAL */}
      {/* ================================= */}

      {showmodal && (
        <Storycreate
          setshowmodal={setshowmodal}
          fetchstories={fetchstories}
        />

      )}
      {viewstory && (<Storyviewer
      viewstory={viewstory}
      setviewstory={setviewstory}
      />)}

    </div>
  );
};

export default StoriesBar;