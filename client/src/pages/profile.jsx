import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";

import Loading from "../components/loading";
import UserProfile from "../components/userprofile";
import ProfilePost from "../components/profilepost";
import EditProfile from "../components/editprofile";
import dummyPosts from "../data/dummyposts";
import api from "../api/axios.js";

const Profile = () => {
    const { profileId } = useParams();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("posts");
    const [showEdit, setShowEdit] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");

    // CURRENT LOGGED-IN USER
    const currentUser = useSelector(
        (state) => state.user.user
    );

    // OWN PROFILE = /profile
    // OTHER PROFILE = /profile/:profileId
    const isOwnProfile = !profileId;

    // FETCH PROFILE
    useEffect(() => {
        const loadProfile = async () => {

            // ==========================================
            // OWN PROFILE
            // ==========================================

            if (!profileId) {
                setProfileUser(currentUser);
                return;
            }

            // ==========================================
            // IF PROFILE ID IS CURRENT USER
            // ==========================================

            if (
                currentUser &&
                (
                    profileId === currentUser._id ||
                    profileId === currentUser.id
                )
            ) {
                setProfileUser(currentUser);
                return;
            }

            // ==========================================
            // FETCH OTHER USER PROFILE
            // ==========================================

            try {
                setProfileLoading(true);
                setProfileError("");

                const token = await getToken();

                if (!token) {
                    throw new Error(
                        "Authentication token not available"
                    );
                }

                const { data } = await api.get(
                    `/api/user/profile/${profileId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("PROFILE API RESPONSE:", data);

                if (!data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to load profile"
                    );
                }

                setProfileUser(data.profile);

            } catch (error) {

                console.error(
                    "PROFILE FETCH ERROR:",
                    error
                );

                setProfileUser(null);

                setProfileError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load this profile"
                );

            } finally {
                setProfileLoading(false);
            }
        };

        loadProfile();

    }, [profileId, currentUser, getToken]);

    // ==========================================
    // POSTS
    // ==========================================

    const posts = useMemo(() => {

        if (!profileUser) return [];

        return dummyPosts.filter(
            (post) =>
                post.user?.id === profileUser._id ||
                post.user?.id === profileUser.id
        );

    }, [profileUser]);

    // ==========================================
    // FILTER POSTS
    // ==========================================

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

    // ==========================================
    // LOADING / ERROR
    // ==========================================

    if (profileLoading || !profileUser) {

        if (profileError) {

            return (
                <div className="flex h-full items-center justify-center bg-gray-50">

                    <div className="text-center">

                        <p className="text-sm font-semibold text-[#17383A]">
                            Profile not found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            {profileError}
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/feed")}
                            className="mt-4 rounded-xl bg-[#17383A] px-5 py-2 text-xs font-semibold text-white"
                        >
                            Back to Feed
                        </button>

                    </div>

                </div>
            );
        }

        return <Loading />;
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="relative h-full overflow-y-auto bg-gray-50 p-6">

            <div className="mx-auto max-w-3xl">

                <div className="overflow-hidden rounded-2xl bg-white shadow">

                    {/* COVER PHOTO */}

                    <div className="h-40 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 md:h-56">

                        {profileUser.cover_photo && (
                            <img
                                src={profileUser.cover_photo}
                                alt={`${profileUser.full_name}'s cover`}
                                className="h-full w-full object-cover"
                            />
                        )}

                    </div>

                    {/* USER PROFILE */}

                  <UserProfile
    user={profileUser}
    posts={posts}
    isOwnProfile={isOwnProfile}
    setshowedit={
        isOwnProfile
            ? setShowEdit
            : undefined
    }
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

            {showEdit && isOwnProfile && (

                <EditProfile
                    setShowEdit={setShowEdit}
                />

            )}

        </div>
    );
};

export default Profile;