import React, { useState } from "react";
import {
  Image,
  Video,
  Type,
  MapPin,
  X,
  Send,
  Sparkles,
} from "lucide-react";

const CreatePost = () => {
  const [postType, setPostType] = useState("text");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview({
      url: URL.createObjectURL(file),
      file,
    });
  };

  const removeMedia = () => {
    setPreview(null);
  };

  const handleTypeChange = (type) => {
    setPostType(type);

    if (type === "text") {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   
  };

  return (
    <div className="min-h-screen bg-[#F3F7F5] px-5 py-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-8">

          <div>
            <div className="flex items-center gap-2 text-[#6B9D96]">

              <Sparkles size={15} />

              <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Create something
              </span>

            </div>

            <h1 className="mt-2 text-4xl font-bold text-[#183B3B] tracking-tight">
              What's happening?
            </h1>

            <p className="mt-2 text-sm text-[#78908D]">
              Turn your thoughts and moments into a post.
            </p>
          </div>

        </div>


        {/* MAIN EDITOR */}
        <form onSubmit={handleSubmit}>

          <div className="grid lg:grid-cols-[1fr_280px] gap-5 items-start">


            {/* ================================= */}
            {/* CANVAS */}
            {/* ================================= */}

            <div
              className="
                relative
                min-h-[520px]
                rounded-[32px]
                overflow-hidden
                bg-white
                shadow-[0_15px_45px_rgba(50,80,75,0.08)]
                border
                border-[#DCE8E5]
              "
            >

              {/* ================================= */}
              {/* TEXT CANVAS */}
              {/* ================================= */}

              {postType === "text" && (

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    p-10
                    bg-gradient-to-br
                    from-white
                    via-[#FAFCFB]
                    to-[#EEF6F3]
                  "
                >

                  {/* Decorative shapes */}

                  <div
                    className="
                      absolute
                      -top-24
                      -right-24
                      w-72
                      h-72
                      rounded-full
                      bg-[#D9ECE7]
                      opacity-70
                    "
                  />

                  <div
                    className="
                      absolute
                      -bottom-32
                      -left-24
                      w-80
                      h-80
                      rounded-full
                      bg-[#E4F1EE]
                      opacity-80
                    "
                  />

                  {/* Small decorative dot */}

                  <div
                    className="
                      absolute
                      top-16
                      left-16
                      w-3
                      h-3
                      rounded-full
                      bg-[#A9CCC6]
                      opacity-60
                    "
                  />

                  <div className="relative z-10 w-full max-w-2xl">

                    <div
                      className="
                        text-7xl
                        font-serif
                        text-[#B4D3CE]
                        leading-none
                      "
                    >
                      “
                    </div>

                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write whatever is on your mind..."
                      className="
                        w-full
                        min-h-[180px]
                        bg-transparent
                        outline-none
                        resize-none
                        text-3xl
                        md:text-4xl
                        font-semibold
                        leading-tight
                        text-[#183B3B]
                        placeholder:text-[#AFC3C0]
                      "
                    />

                    <div
                      className="
                        text-7xl
                        font-serif
                        text-[#B4D3CE]
                        leading-none
                        text-right
                      "
                    >
                      ”
                    </div>

                  </div>

                </div>
              )}


              {/* ================================= */}
              {/* IMAGE CANVAS */}
              {/* ================================= */}

              {postType === "image" && (

                <div className="absolute inset-0">

                  {preview ? (

                    <>
                      <img
                        src={preview.url}
                        alt="Preview"
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/65
                          via-transparent
                          to-black/10
                        "
                      />

                      <button
                        type="button"
                        onClick={removeMedia}
                        className="
                          absolute
                          top-5
                          right-5
                          w-10
                          h-10
                          rounded-full
                          bg-black/40
                          backdrop-blur-md
                          border
                          border-white/20
                          text-white
                          flex
                          items-center
                          justify-center
                          cursor-pointer
                          hover:bg-black/60
                          transition-all
                        "
                      >
                        <X size={18} />
                      </button>

                      <div className="absolute bottom-8 left-8 right-8">

                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Say something about this..."
                          className="
                            w-full
                            bg-transparent
                            outline-none
                            resize-none
                            text-xl
                            font-semibold
                            text-white
                            placeholder:text-white/60
                          "
                          rows={3}
                        />

                      </div>
                    </>

                  ) : (

                    <label
                      className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                        cursor-pointer
                        bg-gradient-to-br
                        from-white
                        via-[#FAFCFB]
                        to-[#EEF6F3]
                        hover:from-[#FFFFFF]
                        hover:to-[#E7F2EF]
                        transition-all
                      "
                    >

                      <div
                        className="
                          w-20
                          h-20
                          rounded-[24px]
                          bg-[#E0EFEB]
                          text-[#4F8981]
                          flex
                          items-center
                          justify-center
                          shadow-sm
                        "
                      >
                        <Image size={30} />
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-[#183B3B]">
                        Drop a moment here
                      </h3>

                      <p className="mt-1 text-xs text-[#91A4A1]">
                        Choose an image from your device
                      </p>

                      <span className="mt-2 text-[10px] text-[#AABBB8]">
                        JPG, PNG, WEBP
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMediaChange}
                        className="hidden"
                      />

                    </label>

                  )}

                </div>
              )}


              {/* ================================= */}
              {/* VIDEO CANVAS */}
              {/* ================================= */}

              {postType === "video" && (

                <div className="absolute inset-0">

                  {preview ? (

                    <>
                      <video
                        src={preview.url}
                        controls
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                      <button
                        type="button"
                        onClick={removeMedia}
                        className="
                          absolute
                          top-5
                          right-5
                          w-10
                          h-10
                          rounded-full
                          bg-black/50
                          backdrop-blur-md
                          border
                          border-white/20
                          text-white
                          flex
                          items-center
                          justify-center
                          cursor-pointer
                          hover:bg-black/70
                          transition-all
                        "
                      >
                        <X size={18} />
                      </button>
                    </>

                  ) : (

                    <label
                      className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                        cursor-pointer
                        bg-gradient-to-br
                        from-white
                        via-[#FAFCFB]
                        to-[#EEF6F3]
                        hover:from-[#FFFFFF]
                        hover:to-[#E7F2EF]
                        transition-all
                      "
                    >

                      <div
                        className="
                          w-20
                          h-20
                          rounded-[24px]
                          bg-[#E0EFEB]
                          text-[#4F8981]
                          flex
                          items-center
                          justify-center
                          shadow-sm
                        "
                      >
                        <Video size={30} />
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-[#183B3B]">
                        Add a video
                      </h3>

                      <p className="mt-1 text-xs text-[#91A4A1]">
                        Share a moment in motion
                      </p>

                      <span className="mt-2 text-[10px] text-[#AABBB8]">
                        MP4, WEBM, MOV
                      </span>

                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleMediaChange}
                        className="hidden"
                      />

                    </label>

                  )}

                </div>
              )}

            </div>


            {/* ================================= */}
            {/* CONTROL PANEL */}
            {/* ================================= */}

            <div
              className="
                bg-white
                border
                border-[#DCE8E5]
                rounded-[28px]
                p-4
                shadow-[0_12px_35px_rgba(50,80,75,0.06)]
              "
            >

              <p
                className="
                  px-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#91A4A1]
                "
              >
                Post type
              </p>


              <div className="mt-3 space-y-2">

                {/* THOUGHT */}

                <button
                  type="button"
                  onClick={() => handleTypeChange("text")}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-2xl
                    cursor-pointer
                    transition-all
                    ${
                      postType === "text"
                        ? "bg-[#183B3B] text-white shadow-md"
                        : "text-[#426360] hover:bg-[#F0F7F5]"
                    }
                  `}
                >

                  <Type size={17} />

                  <div className="text-left">

                    <p className="text-xs font-semibold">
                      Thought
                    </p>

                    <p
                      className={`
                        text-[10px]
                        ${
                          postType === "text"
                            ? "text-white/60"
                            : "text-[#91A4A1]"
                        }
                      `}
                    >
                      Share what's on your mind
                    </p>

                  </div>

                </button>


                {/* IMAGE */}

                <button
                  type="button"
                  onClick={() => handleTypeChange("image")}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-2xl
                    cursor-pointer
                    transition-all
                    ${
                      postType === "image"
                        ? "bg-[#183B3B] text-white shadow-md"
                        : "text-[#426360] hover:bg-[#F0F7F5]"
                    }
                  `}
                >

                  <Image size={17} />

                  <div className="text-left">

                    <p className="text-xs font-semibold">
                      Moment
                    </p>

                    <p
                      className={`
                        text-[10px]
                        ${
                          postType === "image"
                            ? "text-white/60"
                            : "text-[#91A4A1]"
                        }
                      `}
                    >
                      Share a photo
                    </p>

                  </div>

                </button>


                {/* VIDEO */}

                <button
                  type="button"
                  onClick={() => handleTypeChange("video")}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-2xl
                    cursor-pointer
                    transition-all
                    ${
                      postType === "video"
                        ? "bg-[#183B3B] text-white shadow-md"
                        : "text-[#426360] hover:bg-[#F0F7F5]"
                    }
                  `}
                >

                  <Video size={17} />

                  <div className="text-left">

                    <p className="text-xs font-semibold">
                      Motion
                    </p>

                    <p
                      className={`
                        text-[10px]
                        ${
                          postType === "video"
                            ? "text-white/60"
                            : "text-[#91A4A1]"
                        }
                      `}
                    >
                      Share a video
                    </p>

                  </div>

                </button>

              </div>


              {/* DETAILS */}

              <div className="mt-6">

                <p
                  className="
                    px-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#91A4A1]
                  "
                >
                  Details
                </p>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    px-3
                    h-11
                    rounded-xl
                    bg-[#F5F9F8]
                    border
                    border-[#DCE8E5]
                    focus-within:border-[#78AAA2]
                    transition-all
                  "
                >

                  <MapPin
                    size={15}
                    className="text-[#5A928C]"
                  />

                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-xs
                      text-[#183B3B]
                      placeholder:text-[#9BAEAB]
                    "
                  />

                </div>

              </div>


              {/* PUBLISH */}

              <button
                type="submit"
                className="
                  mt-6
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-3
                  rounded-2xl
                  bg-[#183B3B]
                  text-white
                  text-xs
                  font-semibold
                  cursor-pointer
                  hover:bg-[#285757]
                  hover:-translate-y-0.5
                  active:translate-y-0
                  transition-all
                  shadow-md
                  shadow-[#183B3B]/10
                "
              >

                <Send size={15} />

                Publish Post

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreatePost;