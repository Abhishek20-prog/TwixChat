import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Send,
  X,
  Image as ImageIcon,
  Video,
  FileText,
  File,
} from "lucide-react";

const ChatBox = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "other",
      text: "Hey! 👋",
      attachment: null,
      time: "8:41 PM",
    },
    {
      id: 2,
      sender: "me",
      text: "Hey! What's up?",
      attachment: null,
      time: "8:42 PM",
    },
    {
      id: 3,
      sender: "other",
      text: "Nothing much, just working on the project.",
      attachment: null,
      time: "8:43 PM",
    },
    {
      id: 4,
      sender: "me",
      text: "Same here 😭",
      attachment: null,
      time: "8:44 PM",
    },
    {
      id: 5,
      sender: "other",
      text: "Did you finish the homepage?",
      attachment: null,
      time: "8:45 PM",
    },
  ]);

  // Selected attachment
  const [attachment, setAttachment] = useState(null);

  // Attachment preview
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  // Attachment menu
  const [showAttachmentMenu, setShowAttachmentMenu] =
    useState(false);

  // Emoji menu
  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  // File input reference
  const fileInputRef = useRef(null);

  // Message bottom reference
  const messagesEndRef = useRef(null);

  // =====================================================
  // EMOJIS
  // =====================================================

  const emojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😎",
    "😭",
    "😅",
    "🤣",
    "😉",
    "😊",
    "❤️",
    "🔥",
    "👍",
    "👏",
    "🙌",
    "🎉",
    "✨",
    "💯",
    "😮",
    "🤔",
    "😴",
    "🥳",
    "🤝",
    "🙏",
  ];

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBack = () => {
    // If using React Router:
    // navigate("/messages");

    // For now, go back to previous browser page
    window.history.back();
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfileClick = () => {
    // Later:
    // navigate(`/profile/${userId}`);

    console.log("Opening Ananya's profile");
  };

  // =====================================================
  // EMOJI
  // =====================================================

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  // =====================================================
  // ATTACHMENT MENU
  // =====================================================

  const openAttachmentMenu = () => {
    setShowAttachmentMenu((prev) => !prev);
    setShowEmojiPicker(false);
  };

  // =====================================================
  // OPEN FILE PICKER
  // =====================================================

  const openFilePicker = (type) => {
    if (!fileInputRef.current) return;

    // Set accepted file types
    if (type === "image") {
      fileInputRef.current.accept = "image/*";
    }

    if (type === "video") {
      fileInputRef.current.accept = "video/*";
    }

    if (type === "document") {
      fileInputRef.current.accept =
        ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx";
    }

    // Open native File Explorer / Finder
    fileInputRef.current.click();

    setShowAttachmentMenu(false);
  };

  // =====================================================
  // HANDLE FILE
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAttachment(file);

    const previewURL = URL.createObjectURL(file);

    setAttachmentPreview(previewURL);
  };

  // =====================================================
  // REMOVE ATTACHMENT
  // =====================================================

  const removeAttachment = () => {
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }

    setAttachment(null);
    setAttachmentPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // SEND MESSAGE - ASYNC
  // =====================================================

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() && !attachment) {
      return;
    }

    try {
      const newMessage = {
        id: Date.now(),
        sender: "me",
        text: message.trim(),

        attachment: attachment
          ? {
              name: attachment.name,
              type: attachment.type,
              url: attachmentPreview,
              size: attachment.size,
            }
          : null,

        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Simulating API / Socket request
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      // Clear message
      setMessage("");

      // Clear attachment
      setAttachment(null);
      setAttachmentPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
    }
  };

  // =====================================================
  // RECEIVE MESSAGE - ASYNC
  // =====================================================

  const receiveMessage = async (incomingMessage) => {
    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      const receivedMessage = {
        id: Date.now(),
        sender: "other",
        text: incomingMessage.text || "",
        attachment:
          incomingMessage.attachment || null,

        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [
        ...prev,
        receivedMessage,
      ]);

    } catch (error) {
      console.error(
        "Failed to receive message:",
        error
      );
    }
  };

  // =====================================================
  // TEST RECEIVE
  // =====================================================

  const handleTestReceive = async () => {
    await receiveMessage({
      text: "Hey! I just received your message 😄",
    });
  };

  // =====================================================
  // TOGGLE EMOJI PICKER
  // =====================================================

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
    setShowAttachmentMenu(false);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        w-full
        h-screen
        bg-[#F3F7F5]
        flex
        items-center
        justify-center
        p-4
      "
    >

      {/* =================================================
          CHAT CONTAINER
      ================================================= */}

      <div
        className="
          w-full
          max-w-4xl
          h-[90vh]
          bg-white
          rounded-[28px]
          overflow-hidden
          border
          border-[#DCE8E5]
          shadow-[0_20px_60px_rgba(40,80,75,0.10)]
          flex
          flex-col
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            h-[76px]
            flex
            items-center
            justify-between
            px-5
            border-b
            border-[#E6EFED]
            bg-white
          "
        >

          <div className="flex items-center gap-3">

            {/* BACK BUTTON */}

            <button
              type="button"
              onClick={handleBack}
              className="
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                text-[#53706C]
                hover:bg-[#F0F7F5]
                hover:text-[#183B3B]
                cursor-pointer
                transition
              "
            >
              <ArrowLeft size={19} />
            </button>


            {/* PROFILE */}

            <div
              onClick={handleProfileClick}
              className="
                flex
                items-center
                gap-3
                cursor-pointer
                group
              "
            >

              {/* PROFILE IMAGE */}

              <div className="relative">

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-gradient-to-br
                    from-[#79B6AD]
                    to-[#3F8178]
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                    overflow-hidden
                    group-hover:scale-105
                    transition
                  "
                >
                  A
                </div>

                {/* ONLINE */}

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-3
                    h-3
                    bg-[#54B77A]
                    rounded-full
                    border-2
                    border-white
                  "
                />

              </div>


              {/* PROFILE NAME */}

              <div>

                <h2
                  className="
                    text-sm
                    font-bold
                    text-[#183B3B]
                    group-hover:text-[#3F8178]
                    transition
                  "
                >
                  Ananya Sharma
                </h2>

                <p
                  className="
                    text-[11px]
                    text-[#79A099]
                  "
                >
                  Online
                </p>

              </div>

            </div>

          </div>


          {/* MORE */}

          <button
            type="button"
            className="
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              text-[#53706C]
              hover:bg-[#F0F7F5]
              cursor-pointer
              transition
            "
          >
            <MoreVertical size={19} />
          </button>

        </div>


        {/* =================================================
            MESSAGE AREA
        ================================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-6
            space-y-3
            bg-[#FAFCFB]
          "
        >

          {/* DATE */}

          <div className="flex justify-center mb-5">

            <span
              className="
                px-3
                py-1
                rounded-full
                bg-[#EEF5F3]
                text-[10px]
                font-medium
                text-[#78908D]
              "
            >
              Today
            </span>

          </div>


          {/* MESSAGES */}

          {messages.map((msg) => (

            <div
              key={msg.id}
              className={`
                flex
                ${
                  msg.sender === "me"
                    ? "justify-end"
                    : "justify-start"
                }
              `}
            >

              <div
                className={`
                  max-w-[70%]
                  flex
                  flex-col
                  ${
                    msg.sender === "me"
                      ? "items-end"
                      : "items-start"
                  }
                `}
              >

                {/* MESSAGE BUBBLE */}

                <div
                  className={`
                    overflow-hidden
                    rounded-[18px]
                    text-sm
                    leading-relaxed
                    ${
                      msg.sender === "me"
                        ? `
                          bg-[#183B3B]
                          text-white
                          rounded-br-[5px]
                        `
                        : `
                          bg-white
                          text-[#35514E]
                          border
                          border-[#E2EBE8]
                          rounded-bl-[5px]
                        `
                    }
                  `}
                >

                  {/* ATTACHMENT */}

                  {msg.attachment && (

                    <div>

                      {/* IMAGE */}

                      {msg.attachment.type.startsWith(
                        "image/"
                      ) && (

                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          className="
                            w-[280px]
                            max-h-[300px]
                            object-cover
                          "
                        />

                      )}


                      {/* VIDEO */}

                      {msg.attachment.type.startsWith(
                        "video/"
                      ) && (

                        <video
                          src={msg.attachment.url}
                          controls
                          className="
                            w-[280px]
                            max-h-[300px]
                            object-cover
                          "
                        />

                      )}


                      {/* DOCUMENT */}

                      {!msg.attachment.type.startsWith(
                          "image/"
                        ) &&
                        !msg.attachment.type.startsWith(
                          "video/"
                        ) && (

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              px-4
                              py-3
                              min-w-[220px]
                            "
                          >

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-[#EEF5F3]
                                text-[#3F8178]
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <FileText size={19} />
                            </div>

                            <div className="min-w-0">

                              <p
                                className="
                                  text-xs
                                  font-semibold
                                  truncate
                                "
                              >
                                {msg.attachment.name}
                              </p>

                              <p
                                className="
                                  text-[9px]
                                  opacity-60
                                "
                              >
                                Document
                              </p>

                            </div>

                          </div>

                        )}

                    </div>

                  )}


                  {/* MESSAGE TEXT */}

                  {msg.text && (

                    <div className="px-4 py-2.5">
                      {msg.text}
                    </div>

                  )}

                </div>


                {/* TIME */}

                <span
                  className="
                    mt-1
                    px-1
                    text-[9px]
                    text-[#9AAEAA]
                  "
                >
                  {msg.time}
                </span>

              </div>

            </div>

          ))}


          <div ref={messagesEndRef} />

        </div>


        {/* =================================================
            ATTACHMENT PREVIEW
        ================================================= */}

        {attachment && (

          <div
            className="
              px-4
              pt-3
              bg-white
              border-t
              border-[#E6EFED]
            "
          >

            <div
              className="
                relative
                flex
                items-center
                gap-3
                w-fit
                max-w-[300px]
                p-2
                rounded-xl
                bg-[#F4F8F7]
                border
                border-[#DCE8E5]
              "
            >

              {/* IMAGE PREVIEW */}

              {attachment.type.startsWith("image/") && (

                <img
                  src={attachmentPreview}
                  alt="Selected"
                  className="
                    w-16
                    h-16
                    rounded-lg
                    object-cover
                  "
                />

              )}


              {/* VIDEO ICON */}

              {attachment.type.startsWith("video/") && (

                <div
                  className="
                    w-16
                    h-16
                    rounded-lg
                    bg-[#E8F2F0]
                    flex
                    items-center
                    justify-center
                    text-[#3F8178]
                  "
                >
                  <Video size={25} />
                </div>

              )}


              {/* DOCUMENT ICON */}

              {!attachment.type.startsWith("image/") &&
                !attachment.type.startsWith("video/") && (

                  <div
                    className="
                      w-16
                      h-16
                      rounded-lg
                      bg-[#E8F2F0]
                      flex
                      items-center
                      justify-center
                      text-[#3F8178]
                    "
                  >
                    <FileText size={25} />
                  </div>

                )}


              {/* FILE NAME */}

              <div className="max-w-[170px]">

                <p
                  className="
                    text-xs
                    font-semibold
                    text-[#183B3B]
                    truncate
                  "
                >
                  {attachment.name}
                </p>

                <p
                  className="
                    text-[9px]
                    text-[#8CA39F]
                  "
                >
                  Ready to send
                </p>

              </div>


              {/* REMOVE */}

              <button
                type="button"
                onClick={removeAttachment}
                className="
                  absolute
                  -top-2
                  -right-2
                  w-5
                  h-5
                  rounded-full
                  bg-[#183B3B]
                  text-white
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                "
              >
                <X size={11} />
              </button>

            </div>

          </div>

        )}


        {/* =================================================
            INPUT AREA
        ================================================= */}

        <div
          className="
            relative
            px-4
            py-4
            bg-white
            border-t
            border-[#E6EFED]
          "
        >

          {/* ===============================================
              ATTACHMENT MENU
          =============================================== */}

          {showAttachmentMenu && (

            <div
              className="
                absolute
                bottom-[75px]
                left-4
                w-[180px]
                bg-white
                border
                border-[#DCE8E5]
                rounded-2xl
                shadow-[0_15px_40px_rgba(40,80,75,0.15)]
                p-2
                z-50
              "
            >

              {/* IMAGE */}

              <button
                type="button"
                onClick={() =>
                  openFilePicker("image")
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-xl
                  text-left
                  text-sm
                  text-[#35514E]
                  hover:bg-[#F0F7F5]
                  cursor-pointer
                  transition
                "
              >
                <ImageIcon
                  size={18}
                  className="text-[#4C9389]"
                />

                <span>Image</span>
              </button>


              {/* VIDEO */}

              <button
                type="button"
                onClick={() =>
                  openFilePicker("video")
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-xl
                  text-left
                  text-sm
                  text-[#35514E]
                  hover:bg-[#F0F7F5]
                  cursor-pointer
                  transition
                "
              >
                <Video
                  size={18}
                  className="text-[#4C9389]"
                />

                <span>Video</span>
              </button>


              {/* DOCUMENT */}

              <button
                type="button"
                onClick={() =>
                  openFilePicker("document")
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-xl
                  text-left
                  text-sm
                  text-[#35514E]
                  hover:bg-[#F0F7F5]
                  cursor-pointer
                  transition
                "
              >
                <FileText
                  size={18}
                  className="text-[#4C9389]"
                />

                <span>Document</span>
              </button>

            </div>

          )}


          {/* ===============================================
              EMOJI PICKER
          =============================================== */}

          {showEmojiPicker && (

            <div
              className="
                absolute
                bottom-[75px]
                right-4
                w-[280px]
                bg-white
                border
                border-[#DCE8E5]
                rounded-2xl
                shadow-[0_15px_40px_rgba(40,80,75,0.15)]
                p-3
                z-50
              "
            >

              <div
                className="
                  grid
                  grid-cols-6
                  gap-2
                "
              >

                {emojis.map((emoji, index) => (

                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      handleEmojiClick(emoji)
                    }
                    className="
                      w-9
                      h-9
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-xl
                      hover:bg-[#F0F7F5]
                      cursor-pointer
                      transition
                    "
                  >
                    {emoji}
                  </button>

                ))}

              </div>

            </div>

          )}


          {/* ===============================================
              FORM
          =============================================== */}

          <form
            onSubmit={handleSendMessage}
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* ============================================
                HIDDEN FILE INPUT
            ============================================ */}

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />


            {/* ============================================
                ATTACHMENT BUTTON
            ============================================ */}

            <button
              type="button"
              onClick={openAttachmentMenu}
              className="
                flex-shrink-0
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                text-[#63827D]
                hover:bg-[#F0F7F5]
                hover:text-[#3F8178]
                cursor-pointer
                transition
              "
            >
              <Paperclip size={19} />
            </button>


            {/* ============================================
                INPUT
            ============================================ */}

            <div
              className="
                flex-1
                min-w-0
                h-11
                flex
                items-center
                px-4
                rounded-full
                bg-[#F4F8F7]
                border
                border-[#E0EAE7]
                focus-within:border-[#83AEA7]
                transition
              "
            >

              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Type a message..."
                className="
                  flex-1
                  min-w-0
                  bg-transparent
                  outline-none
                  text-sm
                  text-[#183B3B]
                  placeholder:text-[#9BAEAB]
                "
              />


              {/* EMOJI BUTTON */}

              <button
                type="button"
                onClick={toggleEmojiPicker}
                className="
                  flex-shrink-0
                  text-[#718F8A]
                  hover:text-[#3F8178]
                  cursor-pointer
                  transition
                "
              >
                <Smile size={20} />
              </button>

            </div>


            {/* ============================================
                SEND BUTTON
            ============================================ */}

            <button
              type="submit"
              disabled={
                !message.trim() && !attachment
              }
              className="
                flex-shrink-0
                w-11
                h-11
                rounded-full
                bg-[#183B3B]
                text-white
                flex
                items-center
                justify-center
                hover:bg-[#285757]
                disabled:opacity-30
                disabled:cursor-not-allowed
                cursor-pointer
                transition-all
              "
            >
              <Send size={17} />
            </button>

          </form>

        </div>

      </div>


      {/* =================================================
          TEMPORARY TEST RECEIVE BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={handleTestReceive}
        className="
          fixed
          bottom-5
          left-5
          px-4
          py-2
          rounded-xl
          bg-[#183B3B]
          text-white
          text-xs
          font-medium
          shadow-lg
          hover:bg-[#285757]
          cursor-pointer
          transition
        "
      >
        Test Receive
      </button>

    </div>
  );
};

export default ChatBox;