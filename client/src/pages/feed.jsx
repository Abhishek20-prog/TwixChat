import React, { useEffect, useState } from "react";
import dummyPosts from "../data/dummypost";
import Loading from "../components/loading";
import Storiesbar from "../components/storiesbar";
import StoriesBar from "../components/storiesbar";

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = () => {
      setFeed(dummyPosts);
      setLoading(false);
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-[#FFFAF2] py-6 px-4 xl:pr-5">

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto flex gap-6">

        {/* ================================================= */}
        {/* MAIN FEED */}
        {/* ================================================= */}

        <div className="flex-1 min-w-0 space-y-6">

          {/* ================= STORIES ================= */}

          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-sm">

  <div className="flex items-center justify-between mb-4">
    <h1 className="text-xl font-semibold text-[#17383A]">
      Stories
    </h1>

    <button className="text-sm font-medium text-[#155E63] hover:text-[#F26B4D]">
      See all
    </button>
  </div>

  <StoriesBar/>

</div>


          {/* ================= POST LIST ================= */}

          <div className="space-y-5">

            {/* Posts will be added separately */}

          </div>

        </div>


        {/* ================================================= */}
        {/* RIGHT SIDEBAR */}
        {/* ================================================= */}

        <aside className="hidden xl:flex w-[290px] shrink-0 flex-col gap-5">

          {/* ================= SPONSORED ================= */}

          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-[#17383A] font-semibold">
                Sponsored
              </h2>

              <button
                className="
                  text-xs
                  font-medium
                  text-[#7B8989]
                  hover:text-[#155E63]
                  transition-colors
                "
              >
                See all
              </button>

            </div>


            <div className="space-y-5">

              {/* Sponsored Item 1 */}

              <div className="flex gap-3 cursor-pointer group">

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-[#E8F4F3]
                    border
                    border-[#D5E9E7]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <span className="text-[#155E63] font-bold">
                    AI
                  </span>
                </div>

                <div className="min-w-0">

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-[#17383A]
                      group-hover:text-[#155E63]
                      transition-colors
                    "
                  >
                    AI Learning Platform
                  </h3>

                  <p className="text-xs text-[#6B8586] mt-1 leading-4 line-clamp-2">
                    Learn smarter with AI-powered tools.
                  </p>

                  <span className="text-[10px] text-[#A5AEAE] mt-1 block">
                    Sponsored
                  </span>

                </div>

              </div>


              {/* Sponsored Item 2 */}

              <div className="flex gap-3 cursor-pointer group">

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-[#FFF1EC]
                    border
                    border-[#F8DDD4]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <span className="text-[#F26B4D] font-bold">
                    DS
                  </span>
                </div>

                <div className="min-w-0">

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-[#17383A]
                      group-hover:text-[#F26B4D]
                      transition-colors
                    "
                  >
                    Developer Courses
                  </h3>

                  <p className="text-xs text-[#6B8586] mt-1 leading-4 line-clamp-2">
                    Improve your coding skills and build better projects.
                  </p>

                  <span className="text-[10px] text-[#A5AEAE] mt-1 block">
                    Sponsored
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* ================= RECENT MESSAGES ================= */}

          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-[#17383A] font-semibold">
                Recent Messages
              </h2>

              <button
                className="
                  text-xs
                  font-medium
                  text-[#7B8989]
                  hover:text-[#155E63]
                  transition-colors
                "
              >
                See all
              </button>

            </div>


            <div className="space-y-5">

              {/* ================= MESSAGE 1 ================= */}

              <div className="flex items-center gap-3 cursor-pointer group">

                <img
                  src="/assets/dp_riya.jpg"
                  alt="Riya Sharma"
                  className="
                    w-10
                    h-10
                    rounded-full
                    object-cover
                    shrink-0
                    border
                    border-[#E8E2D8]
                  "
                />

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-2">

                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-[#17383A]
                        truncate
                        group-hover:text-[#155E63]
                        transition-colors
                      "
                    >
                      Riya Sharma
                    </h3>

                    <span className="text-[10px] text-[#A5AEAE] shrink-0">
                      2m
                    </span>

                  </div>

                  <p className="text-xs text-[#6B8586] truncate mt-1">
                    Hey! Are you free today?
                  </p>

                </div>

              </div>


              {/* ================= MESSAGE 2 ================= */}

              <div className="flex items-center gap-3 cursor-pointer group">

                <img
                  src="/assets/dp_rohan.jpg"
                  alt="Rohan Kumar"
                  className="
                    w-10
                    h-10
                    rounded-full
                    object-cover
                    shrink-0
                    border
                    border-[#E8E2D8]
                  "
                />

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-2">

                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-[#17383A]
                        truncate
                        group-hover:text-[#155E63]
                        transition-colors
                      "
                    >
                      Rohan Kumar
                    </h3>

                    <span className="text-[10px] text-[#A5AEAE] shrink-0">
                      15m
                    </span>

                  </div>

                  <p className="text-xs text-[#6B8586] truncate mt-1">
                    Check out the new project!
                  </p>

                </div>

              </div>


              {/* ================= MESSAGE 3 ================= */}

              <div className="flex items-center gap-3 cursor-pointer group">

                <img
                  src="/assets/dp_ananya.jpg"
                  alt="Ananya Singh"
                  className="
                    w-10
                    h-10
                    rounded-full
                    object-cover
                    shrink-0
                    border
                    border-[#E8E2D8]
                  "
                />

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-2">

                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-[#17383A]
                        truncate
                        group-hover:text-[#155E63]
                        transition-colors
                      "
                    >
                      Ananya Singh
                    </h3>

                    <span className="text-[10px] text-[#A5AEAE] shrink-0">
                      1h
                    </span>

                  </div>

                  <p className="text-xs text-[#6B8586] truncate mt-1">
                    Thanks for your help! 😊
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= FOOTER ================= */}

          <div className="px-2 py-2">

            <p className="text-[11px] text-[#9AA5A5] leading-5">
              © 2026 TwixChat
            </p>

            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">

              <button className="text-[11px] text-[#9AA5A5] hover:text-[#155E63]">
                Privacy
              </button>

              <button className="text-[11px] text-[#9AA5A5] hover:text-[#155E63]">
                Terms
              </button>

              <button className="text-[11px] text-[#9AA5A5] hover:text-[#155E63]">
                Help
              </button>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default Feed;