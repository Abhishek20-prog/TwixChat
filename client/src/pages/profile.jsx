import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import Loading from "../components/loading";
import UserProfile from "../components/userprofile";
import ProfilePost from "../components/profilepost";
import EditProfile from "../components/editprofile";
import dummyPosts from "../data/dummyposts";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("posts");
    const [showEdit, setShowEdit] = useState(false);

    // ======================================================
    // GET CURRENT USER FROM REDUX
    // ======================================================

    const user = useSelector(
        (state) => state.user.user
    );

    // ======================================================
    // GET USER POSTS
    // ======================================================

    const posts = useMemo(() => {
        if (!user) return [];

        return dummyPosts.filter(
            (post) =>
                post.user?.id === user._id ||
                post.user?.id === user.id
        );
    }, [user]);

    // ======================================================
    // FILTER POSTS
    // ======================================================

    const displayedPosts = useMemo(() => {
        if (activeTab === "posts") {
            return posts;
        }

        if (activeTab === "media") {
            return posts.filter(
                (post) =>
                    post.type === "image" ||
                    post.type === "video"
            );
        }

        return [...posts].sort(
            (a, b) => b.likes - a.likes
        );
    }, [posts, activeTab]);

    // ======================================================
    // LOADING
    // ======================================================

    if (!user) {
        return <Loading />;
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="relative h-full overflow-y-auto bg-gray-50 p-6">
            <div className="mx-auto max-w-3xl">

                <div className="overflow-hidden rounded-2xl bg-white shadow">

                    {/* COVER PHOTO */}

                    <div className="h-40 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 md:h-56">
                        {user.cover_photo && (
                            <img
                                src={user.cover_photo}
                                alt={`${user.full_name}'s cover`}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>

                    {/* USER PROFILE */}

                    <UserProfile
                        user={user}
                        posts={posts}
                        setshowedit={setShowEdit}
                    />
                </div>

                {/* TABS */}

                <div className="mt-6">
                    <div
                        className="
                            mx-auto flex max-w-md
                            rounded-xl
                            border border-[#D8E9E6]
                            bg-white
                            p-1
                            shadow-sm
                        "
                    >
                        {["posts", "media", "likes"].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(tab)
                                    }
                                    className={`
                                        flex-1
                                        cursor-pointer
                                        rounded-lg
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        transition-all
                                        duration-200

                                        ${
                                            activeTab === tab
                                                ? "bg-[#17383A] text-white shadow-sm"
                                                : "text-[#5F7775] hover:bg-[#E8F5F3] hover:text-[#17383A]"
                                        }
                                    `}
                                >
                                    {tab
                                        .charAt(0)
                                        .toUpperCase() +
                                        tab.slice(1)}
                                </button>
                            )
                        )}
                    </div>

                    {/* POSTS */}

                    <div className="mt-6">
                        {displayedPosts.length > 0 ? (
                            <ProfilePost
                                posts={displayedPosts}
                            />
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-sm font-medium text-[#17383A]">
                                    No {activeTab} yet
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Nothing to show here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE */}

            {showEdit && (
                <EditProfile
                    setShowEdit={setShowEdit}
                />
            )}
        </div>
    );
};

export default Profile;