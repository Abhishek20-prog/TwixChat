import {
    MapPin,
    Briefcase,
    Link as LinkIcon,
    Edit,
    Users,
} from "lucide-react";

const UserProfile = ({
    user,
    posts,
    setshowedit,
    profileID,
}) => {
    return (
        <div className="bg-white px-6 pb-6">

            {/* ======================================================
                PROFILE HEADER
            ====================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-end
                    md:justify-between
                "
            >

                {/* ======================================================
                    PROFILE IMAGE + BASIC INFO
                ====================================================== */}

                <div className="flex items-end gap-4">

                    {/* PROFILE PICTURE */}

                    <div className="relative -mt-14 shrink-0">
                        {user.profile_picture ? (
                            <img
                                src={user.profile_picture}
                                alt={user.full_name || "User"}
                                className="
                                    h-28
                                    w-28
                                    rounded-full
                                    border-4
                                    border-white
                                    object-cover
                                    shadow-md
                                "
                            />
                        ) : (
                            <div
                                className="
                                    flex
                                    h-28
                                    w-28
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-4
                                    border-white
                                    bg-[#E8F5F3]
                                    text-3xl
                                    font-bold
                                    text-[#17383A]
                                    shadow-md
                                "
                            >
                                {user.full_name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>
                        )}
                    </div>

                    {/* NAME + USERNAME */}

                    <div className="min-w-0 pb-1">
                        <div className="flex flex-wrap items-center gap-2">

                            <h1
                                className="
                                    truncate
                                    text-xl
                                    font-bold
                                    text-[#17383A]
                                "
                            >
                                {user.full_name || "User"}
                            </h1>

                        </div>

                        <p className="text-sm text-gray-500">
                            @{user.username || "username"}
                        </p>
                    </div>
                </div>

                {/* ======================================================
                    ACTION
                ====================================================== */}

                {!profileID && (
                    <button
                        type="button"
                        onClick={() => setshowedit(true)}
                        className="
                            flex
                            shrink-0
                            cursor-pointer
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#17383A]
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-[#285557]
                            active:scale-95
                        "
                    >
                        <Edit size={16} />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* ======================================================
                BIO
            ====================================================== */}

            {user.bio && (
                <div className="mt-5">
                    <p
                        className="
                            max-w-2xl
                            text-sm
                            leading-relaxed
                            text-gray-600
                        "
                    >
                        {user.bio}
                    </p>
                </div>
            )}

            {/* ======================================================
                PROFILE DETAILS
            ====================================================== */}

            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    gap-x-5
                    gap-y-3
                "
            >

                {/* WORK */}

                {user.work && (
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        "
                    >
                        <Briefcase
                            size={16}
                            className="text-[#17383A]"
                        />

                        <span>{user.work}</span>
                    </div>
                )}

                {/* WORKPLACE */}

                {user.workplace && (
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        "
                    >
                        <Users
                            size={16}
                            className="text-[#17383A]"
                        />

                        <span>{user.workplace}</span>
                    </div>
                )}

                {/* LOCATION */}

                {user.location && (
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        "
                    >
                        <MapPin
                            size={16}
                            className="text-[#17383A]"
                        />

                        <span>{user.location}</span>
                    </div>
                )}

                {/* WEBSITE */}

                {user.website && (
                    <a
                        href={user.website}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            text-sm
                            text-[#285557]
                            hover:underline
                        "
                    >
                        <LinkIcon size={16} />
                        <span>Website</span>
                    </a>
                )}
            </div>

            {/* ======================================================
                HOBBIES / INTERESTS
            ====================================================== */}

            {user.hobbies?.length > 0 && (
                <div className="mt-5">
                    <p
                        className="
                            mb-2
                            text-xs
                            font-semibold
                            text-[#17383A]
                        "
                    >
                        Interests
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {user.hobbies.map((hobby, index) => (
                            <span
                                key={`${hobby}-${index}`}
                                className="
                                    rounded-full
                                    bg-[#E8F5F3]
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-[#285557]
                                "
                            >
                                {hobby}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ======================================================
                STATS
            ====================================================== */}

            <div
                className="
                    mt-6
                    flex
                    items-center
                    gap-8
                    border-t
                    border-gray-100
                    pt-5
                "
            >

                {/* POSTS */}

                <div className="text-center">
                    <p
                        className="
                            text-lg
                            font-bold
                            text-[#17383A]
                        "
                    >
                        {posts?.length || 0}
                    </p>

                    <p className="text-xs text-gray-400">
                        Posts
                    </p>
                </div>

                {/* FOLLOWERS */}

                <div className="text-center">
                    <p
                        className="
                            text-lg
                            font-bold
                            text-[#17383A]
                        "
                    >
                        {user.followers?.length || 0}
                    </p>

                    <p className="text-xs text-gray-400">
                        Followers
                    </p>
                </div>

                {/* FOLLOWING */}

                <div className="text-center">
                    <p
                        className="
                            text-lg
                            font-bold
                            text-[#17383A]
                        "
                    >
                        {user.following?.length || 0}
                    </p>

                    <p className="text-xs text-gray-400">
                        Following
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;