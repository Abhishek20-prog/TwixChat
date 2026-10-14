
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/react";
import { RefreshCw } from "lucide-react";

import Loading from "../components/loading";
import StoriesBar from "../components/storiesbar";
import PostCard from "../components/postcard";
import Recentmessage from "../components/recentmessage";
import Sponsered from "../components/sponsered";
import { fetchRecentMessages } from "../features/messages/messageslice";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const Feed = () => {
    const dispatch = useDispatch();
    const { getToken } = useAuth();

    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const fetchFeed = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const token = await getToken();

            if (!token) {
                throw new Error("Please sign in to view your feed.");
            }

            const response = await fetch(`${API_URL}/api/post/feed`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load posts.");
            }

            if (!data.success) {
                throw new Error(data.message || "Unable to load your feed.");
            }

            const posts = Array.isArray(data.posts) ? data.posts : [];

            setFeed(
                posts.map((post) => ({
                    ...post,
                    id: String(post._id || post.id),
                    _id: String(post._id || post.id),
                    user: post.userId,
                    image_url: Array.isArray(post.image_url)
                        ? post.image_url
                        : [],
                    video_url: Array.isArray(post.video_url)
                        ? post.video_url
                        : [],
                    likes: Array.isArray(post.likes) ? post.likes : [],
                    comments: Array.isArray(post.comments)
                        ? post.comments
                        : [],
                }))
            );
        } catch (err) {
            console.error("Fetch Feed Error:", err);
            setError(err.message || "Something went wrong while loading posts.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [getToken]);

    useEffect(() => {
        fetchFeed();

        const loadRecentMessages = async () => {
            try {
                const token = await getToken();

                if (token) {
                    dispatch(fetchRecentMessages(token));
                }
            } catch (err) {
                console.error("Recent Messages Error:", err);
            }
        };

        loadRecentMessages();
    }, [dispatch, getToken, fetchFeed]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="h-full overflow-y-scroll no-scrollbar py-8 px-4 xl:px-6">
            <div className="w-full max-w-[1400px] mx-auto flex gap-6">
                <div className="flex-1 min-w-0">
                    <div className="mb-8">
                        <StoriesBar />
                    </div>

                   

                    {error && (
                        <div className="mx-4 mb-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() => fetchFeed()}
                                className="mt-2 text-sm font-semibold text-[#155E63] underline dark:text-[#A5D8D5]"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!error && feed.length === 0 ? (
                        <div className="mx-4 rounded-2xl border border-[#58A6A6]/20 bg-white px-6 py-12 text-center shadow-sm dark:bg-[#142E30]">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5F3] text-2xl dark:bg-[#214447]">
                                ✨
                            </div>

                            <h3 className="text-lg font-bold text-[#17383A] dark:text-white">
                                Your feed is waiting
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                                There are no posts to show yet. Create a post
                                or connect with more people to see their updates
                                here.
                            </p>

                            <button
                                type="button"
                                onClick={() => fetchFeed(true)}
                                disabled={refreshing}
                                className="mt-5 rounded-xl bg-gradient-to-r from-[#155E63] to-[#58A6A6] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                                {refreshing ? "Refreshing..." : "Refresh feed"}
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 space-y-6">
                            {feed.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden xl:flex w-[280px] shrink-0 flex-col gap-6">
                    <Sponsered />
                    <Recentmessage />
                </div>
            </div>
        </div>
    );
};

export default Feed;
