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
    const currentUser = dummyUsers[8];

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

      </div>
    </div>
  );
};

export default Profile;