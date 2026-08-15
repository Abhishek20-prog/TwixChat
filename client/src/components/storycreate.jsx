import React, { useState } from "react";
import { ArrowLeft, Sparkles, TextIcon, UploadIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const storyGradients = [
  "linear-gradient(135deg, #155E63 0%, #58A6A6 100%)",
  "linear-gradient(135deg, #F26B4D 0%, #F9B233 100%)",
  "linear-gradient(135deg, #155E63 0%, #F26B4D 100%)",
  "linear-gradient(135deg, #17383A 0%, #2A8C8C 50%, #F26B4D 100%)",
  "linear-gradient(135deg, #F9B233 0%, #F26B4D 50%, #155E63 100%)",
  "linear-gradient(135deg, #1F7375 0%, #155E63 50%, #17383A 100%)",
  "linear-gradient(135deg, #F58A6D 0%, #F26B4D 50%, #E85A3F 100%)",
  "linear-gradient(135deg, #A8D5D2 0%, #58A6A6 50%, #155E63 100%)",
  "linear-gradient(135deg, #F4E6D3 0%, #F9B233 50%, #F26B4D 100%)",
  "linear-gradient(135deg, #155E63 0%, #2A8C8C 50%, #F9B233 100%)",
];

const Storycreate = ({ setshowmodal, fetchstories }) => {
  const [mode, setmode] = useState("text");
  const [background, setbackground] = useState(storyGradients[0]);
  const [text, settext] = useState("");
  const [media, setmedia] = useState(null);
  const [purl, setpurl] = useState(null);

  // ==============================
  // MEDIA UPLOAD
  // ==============================

  const handlemediaupload = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setmedia(file);
      setpurl(URL.createObjectURL(file));
    }
  };

  // ==============================
  // CREATE STORY
  // ==============================

  const handlecreatestory = async () => {
    // Validation
    if (mode === "text" && !text.trim()) {
      throw new Error("Please write something for your story.");
    }

    if (mode === "media" && !media) {
      throw new Error("Please select an image or video.");
    }

    // Temporary API simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log({
      mode,
      text,
      background,
      media,
    });

    // Once backend is connected:
    // await axios.post(...)

    if (fetchstories) {
      fetchstories();
    }

    setshowmodal(false);

    return true;
  };

  // ==============================
  // CREATE WITH TOAST
  // ==============================

  const createStory = () => {
    toast.promise(handlecreatestory(), {
      loading: "Saving story...",
      success: "Story Added!",
      error: (error) => error.message || "Something went wrong",
    });
  };

  return (
    <div className="fixed inset-0 z-[110] min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* HEADER */}

        <div className="text-center mb-4 flex items-center justify-between">
          <button className="text-white p-2 cursor-pointer hover:bg-white/10 rounded-full" onClick={() => setshowmodal(false)}>
            <ArrowLeft />
          </button>

          <h2 className="font-semibold text-lg">Create Story</h2>

          <span className="w-10"></span>
        </div>

        {/* STORY BOX */}

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl p-4">

          {/* STORY PREVIEW */}

          <div className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden" style={{ background }}>
            
            {mode === "text" && (
              <textarea
                className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none placeholder:text-white/60"
                placeholder="What's on your mind?"
                onChange={(e) => settext(e.target.value)}
                value={text}
              />
            )}

            {mode === "media" && purl && (
              media?.type.startsWith("image") ? (
                <img src={purl} alt="" className="object-contain max-h-full max-w-full" />
              ) : (
                <video src={purl} className="object-contain max-h-full max-w-full" controls autoPlay muted />
              )
            )}

          </div>

          {/* GRADIENT SELECTOR */}

          {mode === "text" && (
            <div className="flex mt-4 gap-2 flex-wrap">
              {storyGradients.map((gradient) => (
                <button
                  key={gradient}
                  className="w-7 h-7 rounded-full ring-1 ring-gray-300 cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: gradient }}
                  onClick={() => setbackground(gradient)}
                />
              ))}
            </div>
          )}

          {/* MODE BUTTONS */}

          <div className="flex gap-2 mt-4">

            {/* TEXT */}

            <button
              onClick={() => {
                setmode("text");
                setmedia(null);
                setpurl(null);
              }}
              className={`flex-1 flex items-center cursor-pointer justify-center gap-2 p-2 rounded-lg font-medium transition-all duration-200 ${mode === "text" ? "bg-[#155E63] text-white shadow-md" : "bg-[#E8F3F2] text-[#155E63] border border-[#B8CDCA] hover:bg-[#D7EAE8]"}`}
            >
              <TextIcon size={18} />
              Text
            </button>

            {/* MEDIA */}

            <label
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer font-medium transition-all duration-200 ${mode === "media" ? "bg-[#F26B4D] text-white shadow-md" : "bg-[#FDF0EC] text-[#E85A3F] border border-[#F5C4B8] hover:bg-[#FBE4DE]"}`}
            >
              <input
                onChange={(e) => {
                  handlemediaupload(e);
                  setmode("media");
                }}
                type="file"
                accept="image/*,video/*"
                className="hidden"
              />

              <UploadIcon size={18} />
              Image / Video
            </label>

          </div>

          {/* CREATE BUTTON */}

          <button
            onClick={createStory}
            className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded-lg font-semibold bg-gradient-to-r from-[#155E63] via-[#F26B4D] to-[#F9B233] hover:from-[#124F53] hover:via-[#E85A3F] hover:to-[#E5A21F] active:scale-95 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
          >
            <Sparkles size={18} />
            Create
          </button>

        </div>
      </div>
    </div>
  );
};

export default Storycreate;