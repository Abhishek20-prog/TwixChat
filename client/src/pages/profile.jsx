
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";

import Loading from "../components/loading";
import UserProfile from "../components/userprofile";
import ProfilePost from "../components/profilepost";
import EditProfile from "../components/editprofile";
import api from "../api/axios.js";

const Profile = () => {
    const { profileId } = useParams();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.user);

    const [activeTab, setActiveTab] = useState("posts");
    const [showEdit, setShowEdit] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState("");

    const isOwnProfile = !profileId;

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            const targetId =
                profileId || currentUser?._id || currentUser?.id;

            if (!targetId) {
                setProfileLoading(true);
                return;
            }

            setProfileLoading(true);
            setProfileError("");
            setProfileUser(null);
            setPosts([]);

            try {
                const token = await getToken();

                if (!token) {
                    throw new Error(
                        "Authentication token not available"
                    );
                }

                const { data } = await api.get(
                    `/api/user/profile/${targetId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("PROFILE RESPONSE:", data);
                console.log("PROFILE POSTS:", data.posts);

                if (!data.success) {
                    throw new Error(
                        data.message || "Failed to load profile"
                    );
                }

                if (cancelled) return;

                const user = data.profile || data.user;

                if (!user) {
                    throw new Error(
                        "Profile data is missing from the response"
                    );
                }

                setProfileUser(user);
                setPosts(
                    Array.isArray(data.posts) ? data.posts : []
                );
            } catch (error) {
                if (cancelled) return;

                console.error("PROFILE FETCH ERROR:", error);

                setProfileError(
                    error.response?.data?.message ||
                        error.message ||
                        "Unable to load profile"
                );
            } finally {
                if (!cancelled) {
                    setProfileLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [
        profileId,
        currentUser?._id,
        currentUser?.id,
        getToken,
    ]);

    // Remove a deleted post from the parent state.
    // All profile tabs derive their posts from this state.
    const handlePostDeleted = (deletedPostId) => {
        setPosts((currentPosts) =>
            currentPosts.filter(
                (post) =>
                    String(post._id || post.id) !==
                    String(deletedPostId)
            )
        );
    };

    const displayedPosts = useMemo(() => {
        if (activeTab === "media") {
            return posts.filter((post) => {
                const type = post.post_type || post.type;

                return (
                    type === "image" ||
                    type === "image_text" ||
                    type === "video" ||
                    (Array.isArray(post.image_url) &&
                        post.image_url.length > 0)
                );
            });
        }

        if (activeTab === "likes") {
            return [...posts].sort((a, b) => {
                const aLikes = Array.isArray(a.likes)
                    ? a.likes.length
                    : Number(a.likes) || 0;

                const bLikes = Array.isArray(b.likes)
                    ? b.likes.length
                    : Number(b.likes) || 0;

                return bLikes - aLikes;
            });
        }

        return posts;
    }, [posts, activeTab]);

    if (profileLoading) {
        return <Loading />;
    }

    if (profileError || !profileUser) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50 p-6">
                <div className="text-center">
                    <p className="text-sm font-semibold text-[#17383A]">
                        Profile could not be loaded
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                        {profileError || "Profile not found"}
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

    return (
        <div className="relative h-full overflow-y-auto bg-gray-50 p-6">
            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-2xl bg-white shadow">
                    <div className="h-40 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 md:h-56">
                        {profileUser.cover_photo && (
                            <img
                                src={profileUser.cover_photo}
                                alt={`${profileUser.full_name || "User"}'s cover`}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>

                    <UserProfile
                        user={profileUser}
                        posts={posts}
                        isOwnProfile={isOwnProfile}
                        setshowedit={
                            isOwnProfile ? setShowEdit : undefined
                        }
                    />
                </div>

                <div className="mt-6">
                    <div className="mx-auto flex max-w-md rounded-xl border border-[#D8E9E6] bg-white p-1 shadow-sm">
                        {["posts", "media", "likes"].map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab
                                        ? "bg-[#17383A] text-white shadow-sm"
                                        : "text-[#5F7775] hover:bg-[#E8F5F3] hover:text-[#17383A]"
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() +
                                    tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        {displayedPosts.length > 0 ? (
                            <ProfilePost
                                posts={displayedPosts}
                                canManagePosts={isOwnProfile}
                                onPostDeleted={handlePostDeleted}
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

            {showEdit && isOwnProfile && (
                <EditProfile setShowEdit={setShowEdit} />
            )}
        </div>
    );
};

export default Profile;
