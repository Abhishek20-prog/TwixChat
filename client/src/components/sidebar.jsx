import {
    House,
    MessageCircle,
    Users,
    Search,
    User,
    PlusCircle,
    LogOut,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { useSelector } from "react-redux";

import logo from "../assets/twixchat-removebg-preview.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user } = useSelector((state) => state.user);

    const { signOut, openUserProfile } = useClerk();

    // ======================================================
    // NAVIGATION
    // ======================================================

    const navItems = [
        {
            name: "Feed",
            icon: House,
            path: "/feed",
        },
        {
            name: "Messages",
            icon: MessageCircle,
            path: "/message",
        },
        {
            name: "Connections",
            icon: Users,
            path: "/connections",
        },
        {
            name: "Discover",
            icon: Search,
            path: "/discover",
        },
        {
            name: "Profile",
            icon: User,
            path: "/profile",
        },
    ];

    // ======================================================
    // CLOSE SIDEBAR
    // ======================================================

    const closeSidebar = () => {
        setIsOpen(false);
    };

    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // ======================================================
    // USER INITIAL
    // ======================================================

    const userInitial =
        user?.full_name?.charAt(0)?.toUpperCase() || "U";

    return (
        <>
            {/* ======================================================
                MOBILE OVERLAY
            ====================================================== */}

            {isOpen && (
                <div
                    onClick={closeSidebar}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-[#24202E]/20
                        backdrop-blur-[2px]
                        sm:hidden
                    "
                />
            )}

            {/* ======================================================
                SIDEBAR
            ====================================================== */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-[280px]
                    flex-col
                    overflow-hidden
                    border-r
                    border-[#24202E]/10
                    bg-white
                    shadow-[8px_0_35px_rgba(36,32,46,0.08)]
                    transform
                    transition-transform
                    duration-300
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                    sm:relative
                    sm:flex
                    sm:w-64
                    sm:translate-x-0
                    sm:shadow-none
                `}
            >
                {/* ======================================================
                    LOGO
                ====================================================== */}

                <div
                    className="
                        flex
                        h-20
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-gray-100
                        px-6
                    "
                >
                    <img
                        src={logo}
                        alt="TwixChat"
                        className="
                            h-11
                            w-auto
                            object-contain
                            transition-transform
                            duration-300
                            hover:scale-[1.03]
                        "
                    />

                    <button
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                        className="
                            rounded-lg
                            p-2
                            text-gray-500
                            transition-all
                            duration-200
                            hover:bg-[#FFF9EF]
                            hover:text-[#C68A24]
                            active:scale-90
                            sm:hidden
                        "
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* ======================================================
                    NAVIGATION
                ====================================================== */}

                <nav className="flex-1 overflow-y-auto px-4 py-5">
                    <div className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={closeSidebar}
                                    className={({ isActive }) => `
                                        group
                                        relative
                                        flex
                                        items-center
                                        gap-3
                                        overflow-hidden
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        transition-all
                                        duration-200
                                        ${
                                            isActive
                                                ? `
                                                    bg-[#FFF9EF]
                                                    text-[#24202E]
                                                    shadow-[inset_3px_0_0_#C68A24]
                                                `
                                                : `
                                                    text-gray-600
                                                    hover:bg-[#FFF9EF]/70
                                                    hover:text-[#24202E]
                                                `
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <span
                                                    className="
                                                        absolute
                                                        left-0
                                                        top-1/2
                                                        h-8
                                                        w-1
                                                        -translate-y-1/2
                                                        rounded-r-full
                                                        bg-[#C68A24]
                                                        shadow-[0_0_12px_rgba(198,138,36,0.45)]
                                                    "
                                                />
                                            )}

                                            <Icon
                                                size={18}
                                                strokeWidth={
                                                    isActive
                                                        ? 2.3
                                                        : 2
                                                }
                                                className={`
                                                    relative
                                                    z-10
                                                    shrink-0
                                                    transition-all
                                                    duration-200
                                                    ${
                                                        isActive
                                                            ? "text-[#C68A24]"
                                                            : `
                                                                text-gray-500
                                                                group-hover:translate-x-0.5
                                                                group-hover:text-[#C68A24]
                                                            `
                                                    }
                                                `}
                                            />

                                            <span
                                                className={`
                                                    relative
                                                    z-10
                                                    transition-transform
                                                    duration-200
                                                    ${
                                                        !isActive
                                                            ? "group-hover:translate-x-0.5"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                {item.name}
                                            </span>

                                            {isActive && (
                                                <span
                                                    className="
                                                        absolute
                                                        right-3
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        bg-[#C68A24]
                                                        shadow-[0_0_8px_rgba(198,138,36,0.6)]
                                                    "
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* ======================================================
                        CREATE POST
                    ====================================================== */}

                    <NavLink
                        to="/createpost"
                        onClick={closeSidebar}
                        className="
                            group
                            relative
                            mt-6
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            overflow-hidden
                            rounded-xl
                            bg-[#24202E]
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-[0_5px_18px_rgba(36,32,46,0.15)]
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:bg-[#332D42]
                            hover:shadow-[0_8px_25px_rgba(198,138,36,0.22)]
                            active:translate-y-0
                            active:scale-[0.98]
                        "
                    >
                        <span
                            className="
                                pointer-events-none
                                absolute
                                inset-y-0
                                -left-[70%]
                                w-[45%]
                                -skew-x-[20deg]
                                bg-gradient-to-r
                                from-transparent
                                via-[#C68A24]/50
                                to-transparent
                                transition-all
                                duration-700
                                ease-out
                                group-hover:left-[125%]
                            "
                        />

                        <span
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                rounded-xl
                                bg-[radial-gradient(circle_at_center,rgba(198,138,36,0.18),transparent_65%)]
                                opacity-0
                                transition-opacity
                                duration-300
                                group-hover:opacity-100
                            "
                        />

                        <PlusCircle
                            size={18}
                            className="
                                relative
                                z-10
                                transition-transform
                                duration-300
                                ease-out
                                group-hover:rotate-90
                            "
                        />

                        <span className="relative z-10">
                            Create Post
                        </span>
                    </NavLink>
                </nav>

                {/* ======================================================
                    USER SECTION
                ====================================================== */}

                <div
                    className="
                        flex
                        w-full
                        items-center
                        justify-between
                        border-t
                        border-gray-200
                        p-4
                        px-7
                    "
                >
                    <div className="flex min-w-0 items-center gap-2">
                        {/* ==================================================
                            MONGODB PROFILE PICTURE
                        ================================================== */}

                        <button
                            type="button"
                            onClick={openUserProfile}
                            aria-label="Open account profile"
                            className="
                                shrink-0
                                rounded-full
                                transition-all
                                duration-200
                                hover:scale-105
                                hover:shadow-md
                                active:scale-95
                            "
                        >
                            {user?.profile_picture ? (
                                <img
                                    src={user.profile_picture}
                                    alt={
                                        user.full_name ||
                                        "User"
                                    }
                                    className="
                                        h-9
                                        w-9
                                        rounded-full
                                        object-cover
                                    "
                                />
                            ) : (
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#FFF9EF]
                                        text-sm
                                        font-semibold
                                        text-[#C68A24]
                                    "
                                >
                                    {userInitial}
                                </div>
                            )}
                        </button>

                        {/* ==================================================
                            USER INFO
                        ================================================== */}

                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-medium">
                                {user?.full_name || "User"}
                            </h1>

                            <p className="truncate text-xs text-gray-500">
                                @{user?.username || "username"}
                            </p>
                        </div>
                    </div>

                    {/* ======================================================
                        LOGOUT BUTTON
                    ====================================================== */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="
                            ml-2
                            shrink-0
                            rounded-lg
                            p-2
                            text-gray-400
                            transition-all
                            duration-200
                            hover:bg-red-50
                            hover:text-red-500
                            active:scale-90
                        "
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;