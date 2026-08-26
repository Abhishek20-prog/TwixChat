import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  X,
  User,
  AtSign,
  MapPin,
  FileText,
} from "lucide-react";

import dummyUsers from "../data/dummyUsers";

const EditProfile = ({ user, setUser, setShowEdit }) => {
  const fileInputRef = useRef(null);

  // ==========================================
  // CURRENT USER
  // ==========================================

  const currentUser =
    user || dummyUsers[1];

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
  });

  const [dp, setDp] = useState(
    currentUser?.dp || ""
  );

  const [selectedFile, setSelectedFile] = useState(null);

  // ==========================================
  // UPDATE FORM WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    if (!currentUser) return;

    setFormData({
      name: currentUser.name || "",
      username: currentUser.username || "",
      bio: currentUser.bio || "",
      location: currentUser.location || "",
    });

    setDp(currentUser.dp || "");
  }, [currentUser]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CHANGE PROFILE PICTURE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);

    setDp(imageUrl);
  };

  // ==========================================
  // REMOVE PROFILE PICTURE
  // ==========================================

  const removeImage = () => {
    setDp("");

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // SAVE CHANGES
  // ==========================================
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Show what is being sent
    console.log("Updating profile...");

    // Simulate API request for now
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedUser = {
      ...currentUser,

      name: formData.name.trim(),
      username: formData.username.trim(),
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      dp: dp,

      // Keep this for future backend upload
      dpFile: selectedFile,
    };

    console.log("Profile updated:", updatedUser);

    // Update React state
    if (setUser) {
      setUser(updatedUser);
    }

    // Close modal
    setShowEdit(false);

  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    setShowEdit(false);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/30
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >

      {/* =====================================
          MODAL
      ===================================== */}

      <div
        className="
          w-full
          max-w-xl
          max-h-[90vh]
          overflow-y-auto
          bg-white
          rounded-3xl
          shadow-2xl
        "
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <div
          className="
            sticky
            top-0
            z-10
            bg-white
            border-b
            border-gray-100
            px-5
            py-4
            flex
            items-center
            justify-between
          "
        >

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={handleCancel}
              className="
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                text-gray-500
                hover:bg-gray-100
                cursor-pointer
                transition
              "
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-[#17383A]">
                Edit Profile
              </h2>

              <p className="text-xs text-gray-400">
                Update your profile information
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={handleCancel}
            className="
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              text-gray-400
              hover:bg-gray-100
              hover:text-gray-600
              cursor-pointer
            "
          >
            <X size={18} />
          </button>

        </div>


        {/* =====================================
            FORM
        ===================================== */}

        <form onSubmit={handleSubmit}>

          <div className="p-6">


            {/* ==================================
                PROFILE IMAGE
            ================================== */}

            <div className="flex flex-col items-center">

              <div className="relative">

                {dp ? (

                  <img
                    src={dp}
                    alt={formData.name}
                    className="
                      w-28
                      h-28
                      rounded-full
                      object-cover
                      border-4
                      border-white
                      shadow-lg
                    "
                  />

                ) : (

                  <div
                    className="
                      w-28
                      h-28
                      rounded-full
                      bg-[#E8F5F3]
                      text-[#17383A]
                      flex
                      items-center
                      justify-center
                      text-3xl
                      font-bold
                    "
                  >
                    {formData.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                )}


                {/* CAMERA */}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-9
                    h-9
                    rounded-full
                    bg-[#17383A]
                    text-white
                    border-4
                    border-white
                    flex
                    items-center
                    justify-center
                    hover:bg-[#285557]
                    cursor-pointer
                    transition
                  "
                >
                  <Camera size={15} />
                </button>

              </div>


              {/* FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />


              <div className="flex items-center gap-4 mt-4">

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    text-xs
                    font-semibold
                    text-[#4A8980]
                    hover:text-[#285557]
                    cursor-pointer
                  "
                >
                  Change photo
                </button>

                {dp && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="
                      text-xs
                      font-semibold
                      text-red-400
                      hover:text-red-500
                      cursor-pointer
                    "
                  >
                    Remove
                  </button>
                )}

              </div>

            </div>


            {/* ==================================
                INPUTS
            ================================== */}

            <div className="mt-8 space-y-5">


              {/* NAME */}

              <div>

                <label
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#35514E]
                    mb-2
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
                  placeholder="Your name"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-[#F7FAF9]
                    border
                    border-[#DDE8E5]
                    outline-none
                    text-sm
                    text-[#17383A]
                    focus:border-[#6EA7A0]
                    focus:bg-white
                    transition
                  "
                />

              </div>


              {/* USERNAME */}

              <div>

                <label
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#35514E]
                    mb-2
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
                  placeholder="@username"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-[#F7FAF9]
                    border
                    border-[#DDE8E5]
                    outline-none
                    text-sm
                    text-[#17383A]
                    focus:border-[#6EA7A0]
                    focus:bg-white
                    transition
                  "
                />

              </div>


              {/* BIO */}

              <div>

                <label
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#35514E]
                    mb-2
                  "
                >
                  <FileText size={14} />
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell people about yourself..."
                  rows={4}
                  maxLength={150}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-[#F7FAF9]
                    border
                    border-[#DDE8E5]
                    outline-none
                    resize-none
                    text-sm
                    text-[#17383A]
                    focus:border-[#6EA7A0]
                    focus:bg-white
                    transition
                  "
                />

                <p className="text-right text-[10px] text-gray-400 mt-1">
                  {formData.bio.length}/150
                </p>

              </div>


              {/* LOCATION */}

              <div>

                <label
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#35514E]
                    mb-2
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
                  placeholder="Add location"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    bg-[#F7FAF9]
                    border
                    border-[#DDE8E5]
                    outline-none
                    text-sm
                    text-[#17383A]
                    focus:border-[#6EA7A0]
                    focus:bg-white
                    transition
                  "
                />

              </div>

            </div>


            {/* ==================================
                BUTTONS
            ================================== */}

            <div
              className="
                mt-7
                pt-5
                border-t
                border-gray-100
                flex
                justify-end
                gap-3
              "
            >

              <button
                type="button"
                onClick={handleCancel}
                className="
                  px-5
                  py-3
                  rounded-xl
                  text-xs
                  font-semibold
                  text-gray-500
                  hover:bg-gray-100
                  cursor-pointer
                  transition
                "
              >
                Cancel
              </button>


              <button
                type="submit"
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-[#17383A]
                  text-white
                  text-xs
                  font-semibold
                  flex
                  items-center
                  gap-2
                  hover:bg-[#285557]
                  hover:-translate-y-0.5
                  cursor-pointer
                  transition
                "
              >
                <Check size={15} />
                Save Changes
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditProfile;