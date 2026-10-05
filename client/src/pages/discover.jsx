
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus } from "lucide-react";
import { useAuth } from "@clerk/react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchDiscoverUsers,
    followUser,
    unfollowUser,
} from "../features/connections/connectionslice";

const discover = () => {
    const [search, setSearch] = useState("");
    const [followingId, setFollowingId] = useState(null);
    const [randomUsers, setRandomUsers] = useState([]);

    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const users = useSelector(
        (state) => state.connection.discoverUsers || []
    );

    const following = useSelector(
        (state) => state.connection.following || []
    );

    useEffect(() => {
        const loadDiscoverUsers = async () => {
            try {
                const token = await getToken();

                if (!token) return;

                await dispatch(
                    fetchDiscoverUsers({
                        token,
                        input: "",
                    })
                ).unwrap();
            } catch (error) {
                console.error(
                    "Failed to fetch discover users:",
                    error
                );
            }
        };

        loadDiscoverUsers();
    }, [dispatch, getToken]);

    useEffect(() => {
        if (!users.length) {
            setRandomUsers([]);
            return;
        }

        const shuffledUsers = [...users].sort(
            () => Math.random() - 0.5
        );

        setRandomUsers(shuffledUsers.slice(0, 6));
    }, [users]);

    const usersToDisplay = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (query) {
            return users.filter((user) => {
                return [
                    user.name,
                    user.full_name,
                    user.username,
                    user.bio,
                    user.location,
                    user.email,
                    user.work,
                    user.workplace,
                    user.role,
                    ...(user.hobbies || []),
                ]
                    .filter(Boolean)
                    .some((value) =>
                        value
                            .toString()
                            .toLowerCase()
                            .includes(query)
                    );
            });
        }

        return randomUsers;
    }, [users, randomUsers, search]);

    const isUserFollowing = (userId) => {
        return following.some((item) => {
            const followingId =
                typeof item === "object"
                    ? item._id || item.id
                    : item;

            return (
                followingId?.toString() ===
                userId?.toString()
            );
        });
    };

    const handleFollow = async (e, userId) => {
        e.preventDefault();
        e.stopPropagation();

        if (followingId === userId) return;

        try {
            setFollowingId(userId);

            const token = await getToken();

            if (!token) return;

            const alreadyFollowing =
                isUserFollowing(userId);

            if (alreadyFollowing) {
                await dispatch(
                    unfollowUser({
                        token,
                        id: userId,
                    })
                ).unwrap();

                dispatch({
                    type: "connection/removeFollowing",
                    payload: userId,
                });
            } else {
                await dispatch(
                    followUser({
                        token,
                        id: userId,
                    })
                ).unwrap();

                dispatch({
                    type: "connection/addFollowing",
                    payload: userId,
                });
            }
        } catch (error) {
            console.error(
                "Failed to update follow status:",
                error
            );
        } finally {
            setFollowingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#E8F5F3] px-6 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#17383A]">
                        Discover
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Find interesting people and connect with them.
                    </p>
                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        h-12
                        px-4
                        mb-7
                        bg-white
                        rounded-2xl
                        border
                        border-[#D9E8E5]
                        shadow-sm
                        focus-within:border-[#2E8B72]
                        transition-all
                    "
                >
                    <Search
                        size={19}
                        className="text-gray-400 shrink-0"
                    />

                    <input
                        type="text"
                        placeholder="Search people, hobbies, work, bio..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            bg-transparent
                            outline-none
                            text-sm
                            text-[#17383A]
                            placeholder:text-gray-400
                        "
                    />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-[#17383A]">
                            {search.trim() === ""
                                ? "People you may know"
                                : "Search results"}
                        </h2>

                        <p className="text-xs text-gray-400 mt-1">
                            {search.trim() === ""
                                ? "Discover new people to follow"
                                : `${usersToDisplay.length} people found`}
                        </p>
                    </div>
                </div>

                {usersToDisplay.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {usersToDisplay.map((user) => {
                            const userId =
                                user.id || user._id;

                            const followingUser =
                                isUserFollowing(userId);

                            return (
                                <Link
                                    key={userId}
                                    to={`/profile/${userId}`}
                                    className="
                                        group
                                        block
                                        bg-white
                                        rounded-[24px]
                                        border
                                        border-[#D9E8E5]
                                        p-5
                                        cursor-pointer
                                        transition-all
                                        duration-200
                                        hover:-translate-y-1
                                        hover:shadow-lg
                                        hover:border-[#2E8B72]
                                        active:scale-[0.98]
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0">
                                            {user.dp ||
                                            user.profile_picture ? (
                                                <img
                                                    src={
                                                        user.dp ||
                                                        user.profile_picture
                                                    }
                                                    alt={
                                                        user.name ||
                                                        user.full_name ||
                                                        "User"
                                                    }
                                                    className="
                                                        w-14
                                                        h-14
                                                        rounded-full
                                                        object-cover
                                                        ring-2
                                                        ring-[#E8F5F3]
                                                        transition-transform
                                                        duration-200
                                                        group-hover:scale-105
                                                    "
                                                />
                                            ) : (
                                                <div
                                                    className="
                                                        w-14
                                                        h-14
                                                        rounded-full
                                                        bg-[#E8F5F3]
                                                        text-[#17383A]
                                                        flex
                                                        items-center
                                                        justify-center
                                                        font-semibold
                                                    "
                                                >
                                                    {(
                                                        user.name ||
                                                        user.full_name ||
                                                        "U"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                className="
                                                    font-semibold
                                                    text-[#17383A]
                                                    truncate
                                                    transition-colors
                                                    duration-200
                                                    group-hover:text-[#2E8B72]
                                                "
                                            >
                                                {user.name ||
                                                    user.full_name ||
                                                    "User"}
                                            </h3>

                                            <p className="text-xs text-gray-400 truncate">
                                                @{user.username}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-2">
                                        {user.bio ||
                                            "Just chilling on TwixChat ✨"}
                                    </p>

                                    {user.hobbies?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {user.hobbies
                                                .slice(0, 3)
                                                .map((hobby) => (
                                                    <span
                                                        key={hobby}
                                                        className="
                                                            px-2.5
                                                            py-1
                                                            rounded-full
                                                            bg-[#E8F5F3]
                                                            text-[#285557]
                                                            text-[10px]
                                                            font-medium
                                                        "
                                                    >
                                                        {hobby}
                                                    </span>
                                                ))}
                                        </div>
                                    )}

                                    {(user.role ||
                                        user.workplace) && (
                                        <div className="mt-4">
                                            {user.role && (
                                                <p className="text-[11px] text-gray-400">
                                                    {user.role}
                                                </p>
                                            )}

                                            {user.workplace && (
                                                <p className="text-sm font-medium text-[#17383A]">
                                                    {user.workplace}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-5">
                                        <button
                                            type="button"
                                            disabled={
                                                followingId ===
                                                userId
                                            }
                                            onClick={(e) =>
                                                handleFollow(
                                                    e,
                                                    userId
                                                )
                                            }
                                            className="
                                                w-full
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                py-2.5
                                                rounded-xl
                                                bg-[#17383A]
                                                text-white
                                                text-sm
                                                font-medium
                                                transition-all
                                                duration-200
                                                hover:bg-[#285557]
                                                active:scale-[0.98]
                                                cursor-pointer
                                                disabled:opacity-60
                                                disabled:cursor-not-allowed
                                            "
                                        >
                                            <UserPlus size={16} />

                                            {followingId ===
                                            userId
                                                ? "..."
                                                : followingUser
                                                ? "Unfollow"
                                                : "Follow"}
                                        </button>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div
                            className="
                                w-14
                                h-14
                                mx-auto
                                rounded-full
                                bg-white
                                flex
                                items-center
                                justify-center
                                text-[#17383A]
                                border
                                border-[#D9E8E5]
                            "
                        >
                            <Search size={22} />
                        </div>

                        <h3 className="mt-4 font-semibold text-[#17383A]">
                            No people found
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                            Try searching with another name, hobby,
                            bio or workplace.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default discover;

