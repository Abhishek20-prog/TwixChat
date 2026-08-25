import React, { useEffect, useState } from "react";
import dummyUsers from "../data/dummyUsers";
import dummyPosts from "../data/dummyposts";
import Loading from "../components/loading";
import { useParams } from "react-router-dom";
import UserProfile from "../components/userprofile";

const Profile = () => {
  const{profileID}=useParams()
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    // For now, use the first user
    const currentUser = dummyUsers[1];

    setUser(currentUser);

    const userPosts = dummyPosts.filter(
      (post) => post.user.id === currentUser.id
    );

    setPosts(userPosts);
  }, []);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="relative h-full overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* Cover */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover && (
              <img
                src={user.cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <UserProfile
  user={user}
  posts={posts}
  setshowedit={setShowEdit}
  profileID={profileID}
/>
          
        </div>
        {/* Tabs */}
<div className="mt-6">
  <div className="bg-white rounded-xl shadow-sm p-1 flex max-w-md mx-auto border border-[#D8E9E6]">
    
    {["posts", "media", "likes"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`
          flex-1
          px-4
          py-2
          text-sm
          font-medium
          rounded-lg
          transition-all
          duration-200
          cursor-pointer
          ${
            activeTab === tab
              ? "bg-[#17383A] text-white shadow-sm"
              : "text-[#5F7775] hover:bg-[#E8F5F3] hover:text-[#17383A]"
          }
        `}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}

  </div>
  
</div>

      </div>

    </div>
  );
};

export default Profile;