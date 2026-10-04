import { useEffect, useRef, useState } from "react";

import {
    ArrowLeft,
    Camera,
    Check,
    X,
    User,
    AtSign,
    MapPin,
    FileText,
    Image,
} from "lucide-react";

import { useAuth } from "@clerk/react";
import { useDispatch, useSelector } from "react-redux";

import { updateCurrentUser } from "../features/user/userslice";

const EditProfile = ({ setShowEdit }) => {
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const { user, loading, error } = useSelector(
        (state) => state.user
    );

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        bio: "",
        location: "",
    });

    // ======================================================
    // PROFILE PHOTO
    // ======================================================

    const [dp, setDp] = useState("");
    const [selectedProfileFile, setSelectedProfileFile] =
        useState(null);

    const [removeProfilePicture, setRemoveProfilePicture] =
        useState(false);

    // ======================================================
    // COVER PHOTO
    // ======================================================

    const [coverPhoto, setCoverPhoto] = useState("");
    const [selectedCoverFile, setSelectedCoverFile] =
        useState(null);

    const [removeCoverPhoto, setRemoveCoverPhoto] =
        useState(false);

    // ======================================================
    // LOAD USER DATA
    // ======================================================

   const initializedRef = useRef(false);

useEffect(() => {
    if (!user || initializedRef.current) return;

    initializedRef.current = true;

    setFormData({
        name: user.full_name || "",
        username: user.username || "",
        bio: user.bio || "",
        location: user.location || "",
    });

    setDp(user.profile_picture || "");
    setCoverPhoto(user.cover_photo || "");

    setSelectedProfileFile(null);
    setSelectedCoverFile(null);
    setRemoveProfilePicture(false);
    setRemoveCoverPhoto(false);
}, [user]);

    // ======================================================
    // FORM CHANGE
    // ======================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ======================================================
    // ENTER KEY HANDLER
    // ENTER = SAVE
    // SHIFT + ENTER = NEW LINE IN BIO
    // ======================================================

    const handleKeyDown = (e) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey &&
            !loading
        ) {
            e.preventDefault();

            e.currentTarget.form?.requestSubmit();
        }
    };

    // ======================================================
    // PROFILE IMAGE CHANGE
    // ======================================================

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedProfileFile(file);

        const imageUrl =
            URL.createObjectURL(file);

        setDp(imageUrl);

        setRemoveProfilePicture(false);
    };

    // ======================================================
    // REMOVE PROFILE IMAGE
    // ======================================================

    const removeProfileImage = () => {
        setDp("");
        setSelectedProfileFile(null);
        setRemoveProfilePicture(true);

        if (profileInputRef.current) {
            profileInputRef.current.value = "";
        }
    };

    // ======================================================
    // COVER IMAGE CHANGE
    // ======================================================

    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedCoverFile(file);

        const imageUrl =
            URL.createObjectURL(file);

        setCoverPhoto(imageUrl);

        setRemoveCoverPhoto(false);
    };

    // ======================================================
    // REMOVE COVER IMAGE
    // ======================================================

    const removeCoverImage = () => {
        setCoverPhoto("");
        setSelectedCoverFile(null);
        setRemoveCoverPhoto(true);

        if (coverInputRef.current) {
            coverInputRef.current.value = "";
        }
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        try {
            const token = await getToken();

            if (!token) {
                console.error(
                    "No Clerk token received"
                );
                return;
            }

            const userData = new FormData();

            // ==================================================
            // TEXT DATA
            // ==================================================

            userData.append(
                "full_name",
                formData.name.trim()
            );

            userData.append(
                "username",
                formData.username.trim()
            );

            userData.append(
                "bio",
                formData.bio.trim()
            );

            userData.append(
                "location",
                formData.location.trim()
            );

            // ==================================================
            // PROFILE IMAGE
            // ==================================================

            if (selectedProfileFile) {
                userData.append(
                    "profile",
                    selectedProfileFile
                );
            }

            if (
                removeProfilePicture &&
                !selectedProfileFile
            ) {
                userData.append(
                    "remove_profile_picture",
                    "true"
                );
            }

            // ==================================================
            // COVER IMAGE
            // ==================================================

            if (selectedCoverFile) {
                userData.append(
                    "cover",
                    selectedCoverFile
                );
            }

            if (
                removeCoverPhoto &&
                !selectedCoverFile
            ) {
                userData.append(
                    "remove_cover_photo",
                    "true"
                );
            }

            // ==================================================
            // UPDATE USER
            // ==================================================

            await dispatch(
                updateCurrentUser({
                    token,
                    userData,
                })
            ).unwrap();

            // ==================================================
            // CLOSE MODAL
            // ==================================================

            setShowEdit(false);
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );
        }
    };

    // ======================================================
    // CANCEL
    // ======================================================

    const handleCancel = () => {
        setShowEdit(false);
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/30
                p-4
                backdrop-blur-sm
            "
        >
            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-xl
                    overflow-y-auto
                    rounded-3xl
                    bg-white
                    shadow-2xl
                "
            >
                {/* ======================================================
                    HEADER
                ====================================================== */}

                <div
                    className="
                        sticky
                        top-0
                        z-20
                        flex
                        items-center
                        justify-between
                        border-b
                        border-gray-100
                        bg-white
                        px-5
                        py-4
                    "
                >
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="
                                flex
                                h-9
                                w-9
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                text-gray-500
                                transition
                                hover:bg-gray-100
                            "
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-[#17383A]
                                "
                            >
                                Edit Profile
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                "
                            >
                                Update your profile information
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="
                            flex
                            h-9
                            w-9
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-full
                            text-gray-400
                            hover:bg-gray-100
                            hover:text-gray-600
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6">

                        {/* ==================================================
                            COVER PHOTO
                        ================================================== */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-semibold
                                    text-[#35514E]
                                "
                            >
                                <Image size={14} />
                                Cover Photo
                            </label>

                            <div
                                className="
                                    relative
                                    h-40
                                    w-full
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-[#DDE8E5]
                                    bg-gradient-to-r
                                    from-[#E8F5F3]
                                    via-[#F7FAF9]
                                    to-[#E8F5F3]
                                "
                            >
                                {coverPhoto ? (
                                    <img
                                        src={coverPhoto}
                                        alt="Cover preview"
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />
                                ) : (
                                    <div
                                        className="
                                            flex
                                            h-full
                                            w-full
                                            flex-col
                                            items-center
                                            justify-center
                                            gap-2
                                            text-gray-400
                                        "
                                    >
                                        <Image size={28} />

                                        <p className="text-xs">
                                            No cover photo
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        coverInputRef.current?.click()
                                    }
                                    className="
                                        absolute
                                        bottom-3
                                        right-3
                                        flex
                                        h-9
                                        w-9
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-2
                                        border-white
                                        bg-[#17383A]
                                        text-white
                                        shadow-md
                                        transition
                                        hover:bg-[#285557]
                                    "
                                >
                                    <Camera size={15} />
                                </button>
                            </div>

                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleCoverImageChange
                                }
                                className="hidden"
                            />

                            <div
                                className="
                                    mt-3
                                    flex
                                    items-center
                                    gap-4
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        coverInputRef.current?.click()
                                    }
                                    className="
                                        cursor-pointer
                                        text-xs
                                        font-semibold
                                        text-[#4A8980]
                                        hover:text-[#285557]
                                    "
                                >
                                    {coverPhoto
                                        ? "Change cover"
                                        : "Add cover photo"}
                                </button>

                                {coverPhoto && (
                                    <button
                                        type="button"
                                        onClick={
                                            removeCoverImage
                                        }
                                        className="
                                            cursor-pointer
                                            text-xs
                                            font-semibold
                                            text-red-400
                                            hover:text-red-500
                                        "
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ==================================================
                            PROFILE PHOTO
                        ================================================== */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                items-center
                            "
                        >
                            <div className="relative">
                                {dp ? (
                                    <img
                                        src={dp}
                                        alt={
                                            formData.name ||
                                            "User"
                                        }
                                        className="
                                            h-28
                                            w-28
                                            rounded-full
                                            border-4
                                            border-white
                                            object-cover
                                            shadow-lg
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
                                            bg-[#E8F5F3]
                                            text-3xl
                                            font-bold
                                            text-[#17383A]
                                        "
                                    >
                                        {formData.name
                                            ?.charAt(0)
                                            ?.toUpperCase() ||
                                            "U"}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        profileInputRef.current?.click()
                                    }
                                    className="
                                        absolute
                                        bottom-0
                                        right-0
                                        flex
                                        h-9
                                        w-9
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-4
                                        border-white
                                        bg-[#17383A]
                                        text-white
                                        transition
                                        hover:bg-[#285557]
                                    "
                                >
                                    <Camera size={15} />
                                </button>
                            </div>

                            <input
                                ref={profileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleProfileImageChange
                                }
                                className="hidden"
                            />

                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    gap-4
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        profileInputRef.current?.click()
                                    }
                                    className="
                                        cursor-pointer
                                        text-xs
                                        font-semibold
                                        text-[#4A8980]
                                        hover:text-[#285557]
                                    "
                                >
                                    Change photo
                                </button>

                                {dp && (
                                    <button
                                        type="button"
                                        onClick={
                                            removeProfileImage
                                        }
                                        className="
                                            cursor-pointer
                                            text-xs
                                            font-semibold
                                            text-red-400
                                            hover:text-red-500
                                        "
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ==================================================
                            FORM FIELDS
                        ================================================== */}

                        <div className="mt-8 space-y-5">

                            {/* NAME */}

                            <div>
                                <label
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        text-[#35514E]
                                    "
                                >
                                    <User size={14} />
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Your name"
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#DDE8E5]
                                        bg-[#F7FAF9]
                                        px-4
                                        text-sm
                                        text-[#17383A]
                                        outline-none
                                        transition
                                        focus:border-[#6EA7A0]
                                        focus:bg-white
                                    "
                                />
                            </div>

                            {/* USERNAME */}

                            <div>
                                <label
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        text-[#35514E]
                                    "
                                >
                                    <AtSign size={14} />
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="@username"
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#DDE8E5]
                                        bg-[#F7FAF9]
                                        px-4
                                        text-sm
                                        text-[#17383A]
                                        outline-none
                                        transition
                                        focus:border-[#6EA7A0]
                                        focus:bg-white
                                    "
                                />
                            </div>

                            {/* BIO */}

                            <div>
                                <label
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        text-[#35514E]
                                    "
                                >
                                    <FileText size={14} />
                                    Bio
                                </label>

                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Tell people about yourself..."
                                    rows={4}
                                    maxLength={150}
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-[#DDE8E5]
                                        bg-[#F7FAF9]
                                        px-4
                                        py-3
                                        text-sm
                                        text-[#17383A]
                                        outline-none
                                        transition
                                        focus:border-[#6EA7A0]
                                        focus:bg-white
                                    "
                                />

                                <p
                                    className="
                                        mt-1
                                        text-right
                                        text-[10px]
                                        text-gray-400
                                    "
                                >
                                    {formData.bio.length}/150
                                </p>
                            </div>

                            {/* LOCATION */}

                            <div>
                                <label
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        text-[#35514E]
                                    "
                                >
                                    <MapPin size={14} />
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add location"
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#DDE8E5]
                                        bg-[#F7FAF9]
                                        px-4
                                        text-sm
                                        text-[#17383A]
                                        outline-none
                                        transition
                                        focus:border-[#6EA7A0]
                                        focus:bg-white
                                    "
                                />
                            </div>
                        </div>

                        {/* ==================================================
                            ERROR
                        ================================================== */}

                        {error && (
                            <p
                                className="
                                    mt-4
                                    text-xs
                                    text-red-500
                                "
                            >
                                {error}
                            </p>
                        )}

                        {/* ==================================================
                            ACTION BUTTONS
                        ================================================== */}

                        <div
                            className="
                                mt-7
                                flex
                                justify-end
                                gap-3
                                border-t
                                border-gray-100
                                pt-5
                            "
                        >
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="
                                    cursor-pointer
                                    rounded-xl
                                    px-5
                                    py-3
                                    text-xs
                                    font-semibold
                                    text-gray-500
                                    transition
                                    hover:bg-gray-100
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-[#17383A]
                                    px-6
                                    py-3
                                    text-xs
                                    font-semibold
                                    text-white
                                    transition
                                    hover:-translate-y-0.5
                                    hover:bg-[#285557]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    disabled:hover:translate-y-0
                                "
                            >
                                <Check size={15} />

                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;