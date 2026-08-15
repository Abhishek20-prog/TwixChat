import React, { useEffect, useState } from "react";
import moment from "moment";

import dummyPosts from "../data/dummypost";
import Loading from "../components/loading";
import StoriesBar from "../components/storiesbar";

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = () => {
    setFeed(dummyPosts);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-full overflow-y-scroll no-scrollbar py-8 px-4 xl:px-6">
      
      {/* ========================= */}
      {/* MAIN LAYOUT */}
      {/* ========================= */}

      <div className="w-full max-w-[1400px] mx-auto flex gap-6">

        {/* ========================= */}
        {/* MAIN FEED */}
        {/* ========================= */}

        <div className="flex-1 min-w-0">

          {/* Stories */}

          <div className="mb-8">
            <StoriesBar />
          </div>

          {/* ========================= */}
          {/* POST FEED */}
          {/* ========================= */}

          <div className="w-full">

            <h1 className="text-xl font-semibold text-[#17383A] mb-5">
             
            </h1>

            <div className="space-y-5">

              {feed.map((post) => (

                <div
                  key={post.id}
                  className="
                    w-full
                    rounded-[28px]
                    bg-white/80
                    border
                    border-[#E8E2D8]
                    shadow-sm
                    p-5
                    transition-all
                    duration-300
                    hover:shadow-md
                  "
                >

                  {/* ========================= */}
                  {/* USER INFO */}
                  {/* ========================= */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <img
                        src={post.user.dp}
                        alt={post.user.name}
                        className="
                          w-11
                          h-11
                          rounded-full
                          object-cover
                          border-2
                          border-[#DCE8E6]
                        "
                      />

                      <div>

                        <h2 className="text-sm font-semibold text-[#17383A]">
                          {post.user.name}
                        </h2>

                        <p className="text-xs text-[#819493]">
                          {post.user.username} · Posted{" "}
                          {moment(post.createdAt).fromNow()}
                        </p>

                      </div>

                    </div>


                    {/* More button */}

                    <button
                      className="
                        w-8
                        h-8
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-[#819493]
                        hover:bg-[#F1F7F6]
                        transition
                      "
                    >
                      •••
                    </button>

                  </div>


                  {/* ========================= */}
                  {/* POST CONTENT */}
                  {/* ========================= */}

                  <div className="mt-4">

                    {/* ========================= */}
                    {/* TEXT POST */}
                    {/* ========================= */}

                    {post.type === "text" && (

                      <p className="text-[15px] leading-7 text-[#365455]">
                        {post.content}
                      </p>

                    )}


                    {/* ========================= */}
                    {/* PHOTO POST */}
                    {/* ========================= */}

                    {post.type === "photo" && (

                      <>

                        <p className="text-[15px] leading-7 text-[#365455] mb-4">
                          {post.content}
                        </p>

                        <img
                          src={post.image}
                          alt="Post"
                          loading="lazy"
                          className="
                            w-full
                            max-h-[500px]
                            object-cover
                            rounded-[22px]
                            block
                          "
                        />

                      </>

                    )}


                    {/* ========================= */}
                    {/* VIDEO POST */}
                    {/* ========================= */}

                   {/* VIDEO POST */}
{post.type === "video" && (
  <>
    <p className="text-[15px] leading-7 text-[#365455] mb-4">
      {post.content}
    </p>

    <div
      className="
        w-full
        overflow-hidden
        rounded-[22px]
        bg-black
      "
    >
      <video
        src={post.video}
        poster={post.thumbnail}
        autoPlay
        muted
        playsInline
        controls
        preload="metadata"
        className="
          w-full
          max-h-[500px]
          object-contain
          bg-black
          block
          cursor-pointer
        "
      >
        Your browser does not support the video tag.
      </video>
    </div>
  </>
)}

                  </div>


                  {/* ========================= */}
                  {/* POST ACTIONS */}
                  {/* ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-6
                      mt-5
                      pt-4
                      border-t
                      border-[#E8E2D8]
                    "
                  >

                    {/* Likes */}

                    <button
                      className="
                        text-sm
                        text-[#819493]
                        hover:text-[#F26B4D]
                        transition
                      "
                    >
                      ♡ {post.likes}
                    </button>


                    {/* Comments */}

                    <button
                      className="
                        text-sm
                        text-[#819493]
                        hover:text-[#155E63]
                        transition
                      "
                    >
                      💬 {post.comments}
                    </button>


                    {/* Share */}

                    <button
                      className="
                        ml-auto
                        text-sm
                        text-[#819493]
                        hover:text-[#155E63]
                        transition
                      "
                    >
                      Share
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* ========================= */}
        {/* RIGHT SIDEBAR */}
        {/* ========================= */}

        <div
          className="
            hidden
            xl:flex
            w-[280px]
            shrink-0
            flex-col
            gap-6
          "
        >

          {/* ========================= */}
          {/* SPONSORED */}
          {/* ========================= */}

          <div
            className="
              rounded-[28px]
              bg-white/70
              border
              border-[#E8E2D8]
              p-5
              shadow-sm
            "
          >

            <h2 className="text-[15px] font-semibold text-[#17383A]">
              Sponsored
            </h2>

            <div
              className="
                mt-4
                h-[120px]
                rounded-[20px]
                bg-[#F8FCFB]
                border
                border-dashed
                border-[#C9D2D0]
              "
            />

          </div>


          {/* ========================= */}
          {/* RECENT MESSAGES */}
          {/* ========================= */}

          <div
            className="
              rounded-[28px]
              bg-white/70
              border
              border-[#E8E2D8]
              p-5
              shadow-sm
            "
          >

            <h2 className="text-[15px] font-semibold text-[#17383A]">
              Recent Messages
            </h2>

            <div
              className="
                mt-4
                h-[180px]
                rounded-[20px]
                bg-[#F8FCFB]
                border
                border-dashed
                border-[#C9D2D0]
              "
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Feed;