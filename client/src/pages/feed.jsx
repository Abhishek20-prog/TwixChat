import React, { useEffect, useState } from "react";
import moment from "moment";

import dummyPosts from "../data/dummypost";
import Loading from "../components/loading";
import StoriesBar from "../components/storiesbar";
import PostCard from "../components/postcard";
import Recentmessage from "../components/recentmessage";
import Sponsered from "../components/sponsered";

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

            <div className="p-4 space-y-6">
      {dummyPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
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
<Sponsered/>


          {/* ========================= */}
          {/* RECENT MESSAGES */}
          {/* ========================= */}
<Recentmessage/>
          

        </div>

      </div>

    </div>
  );
};

export default Feed;