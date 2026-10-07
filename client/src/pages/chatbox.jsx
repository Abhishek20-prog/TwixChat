import React, { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchConversation,
    sendNewMessage,
} from "../features/messages/messageslice";

const ChatBox = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const {
        messages,
        selectedUser,
        loading,
        sending,
    } = useSelector((state) => state.message);

    const currentUser = useSelector(
        (state) => state.user.user
    );

    const [message, setMessage] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] =
        useState(null);
    const [showAttachmentMenu, setShowAttachmentMenu] =
        useState(false);
    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        const loadConversation = async () => {
            if (!userId) return;

            const token = await getToken();

            if (!token) return;

            dispatch(
                fetchConversation({
                    token,
                    userId,
                })
            );
        };

        loadConversation();
    }, [userId, getToken, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (attachmentPreview) {
                URL.revokeObjectURL(attachmentPreview);
            }
        };
    }, [attachmentPreview]);

    const handleBack = () => {
        navigate("/messages");
    };

    const handleProfileClick = () => {
        if (selectedUser?._id) {
            navigate(`/profile/${selectedUser._id}`);
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessage((prev) => prev + emoji);
    };

    const openAttachmentMenu = () => {
        setShowAttachmentMenu((prev) => !prev);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
        setShowAttachmentMenu(false);
    };

    const openFilePicker = (type) => {
        if (!fileInputRef.current) return;

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

        fileInputRef.current.click();
        setShowAttachmentMenu(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (attachmentPreview) {
            URL.revokeObjectURL(attachmentPreview);
        }

        setAttachment(file);

        const previewURL = URL.createObjectURL(file);

        setAttachmentPreview(previewURL);
    };

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

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!userId) return;

        if (!message.trim() && !attachment) return;

        if (sending) return;

        const token = await getToken();

        if (!token) return;

        let messageType = "text";

        if (attachment) {
            if (attachment.type.startsWith("image/")) {
                messageType = "image";
            } else if (
                attachment.type.startsWith("video/")
            ) {
                messageType = "video";
            } else {
                messageType = "file";
            }
        }

        const formData = new FormData();

        formData.append("receiverId", userId);
        formData.append("content", message.trim());
        formData.append("messageType", messageType);

        if (attachment) {
            formData.append("file", attachment);
        }

        const result = await dispatch(
            sendNewMessage({
                token,
                messageData: formData,
            })
        );

        if (sendNewMessage.fulfilled.match(result)) {
            setMessage("");
            removeAttachment();
            setShowAttachmentMenu(false);
            setShowEmojiPicker(false);
        }
    };

    if (loading && !selectedUser) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[#F3F7F5]">
                <p className="text-sm text-gray-500">
                    Loading conversation...
                </p>
            </div>
        );
    }

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
                            <div className="relative">
                                {selectedUser?.profile_picture ? (
                                    <img
                                        src={
                                            selectedUser.profile_picture
                                        }
                                        alt={
                                            selectedUser.full_name
                                        }
                                        className="
                                            w-11
                                            h-11
                                            rounded-full
                                            object-cover
                                            group-hover:scale-105
                                            transition
                                        "
                                    />
                                ) : (
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
                                        {selectedUser?.full_name
                                            ?.charAt(0)
                                            .toUpperCase() ||
                                            "U"}
                                    </div>
                                )}
                            </div>

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
                                    {selectedUser?.full_name ||
                                        "User"}
                                </h2>

                                <p
                                    className="
                                        text-[11px]
                                        text-[#79A099]
                                    "
                                >
                                    @
                                    {selectedUser?.username ||
                                        "user"}
                                </p>
                            </div>
                        </div>
                    </div>

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
                    {messages.length === 0 && !loading && (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-sm text-gray-400">
                                No messages yet. Start the conversation.
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => {
                        const senderId =
                            msg.senderId?._id ||
                            msg.senderId;

                        const currentUserId =
                            currentUser?._id ||
                            currentUser?.id;

                        const isMine =
                            String(senderId) ===
                            String(currentUserId);

                        return (
                            <div
                                key={msg._id}
                                className={`
                                    flex
                                    ${
                                        isMine
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
                                            isMine
                                                ? "items-end"
                                                : "items-start"
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            overflow-hidden
                                            rounded-[18px]
                                            text-sm
                                            leading-relaxed
                                            ${
                                                isMine
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
                                        {msg.messageType ===
                                            "image" && (
                                            <img
                                                src={msg.content}
                                                alt="Message attachment"
                                                className="
                                                    w-[280px]
                                                    max-h-[300px]
                                                    object-cover
                                                "
                                            />
                                        )}

                                        {msg.messageType ===
                                            "video" && (
                                            <video
                                                src={msg.content}
                                                controls
                                                className="
                                                    w-[280px]
                                                    max-h-[300px]
                                                    object-cover
                                                "
                                            />
                                        )}

                                        {msg.messageType ===
                                            "file" && (
                                            <a
                                                href={msg.content}
                                                target="_blank"
                                                rel="noreferrer"
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
                                                    <FileText
                                                        size={19}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold truncate">
                                                        Open file
                                                    </p>

                                                    <p className="text-[9px] opacity-60">
                                                        Attachment
                                                    </p>
                                                </div>
                                            </a>
                                        )}

                                        {msg.messageType ===
                                            "text" && (
                                            <div className="px-4 py-2.5">
                                                {msg.content}
                                            </div>
                                        )}
                                    </div>

                                    <span
                                        className="
                                            mt-1
                                            px-1
                                            text-[9px]
                                            text-[#9AAEAA]
                                        "
                                    >
                                        {new Date(
                                            msg.createdAt
                                        ).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

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
                            {attachment.type.startsWith(
                                "image/"
                            ) && (
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

                            {attachment.type.startsWith(
                                "video/"
                            ) && (
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

                            {!attachment.type.startsWith(
                                "image/"
                            ) &&
                                !attachment.type.startsWith(
                                    "video/"
                                ) && (
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
                            <div className="grid grid-cols-6 gap-2">
                                {emojis.map((emoji, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                            handleEmojiClick(
                                                emoji
                                            )
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

                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />

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

                        <button
                            type="submit"
                            disabled={
                                (!message.trim() &&
                                    !attachment) ||
                                sending
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
        </div>
    );
};

export default ChatBox;