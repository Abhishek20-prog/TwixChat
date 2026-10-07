
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
    File,
    Copy,
    Reply,
    Trash2,
    Flag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchConversation,
    sendNewMessage,
    deleteMessageForSender,
    deleteMessageForReceiver,
} from "../features/messages/messageslice";

const reactionsList = [
    "❤️",
    "👍",
    "😂",
    "😍",
    "😮",
    "😢",
    "😡",
    "👏",
    "🔥",
    "🎉",
    "🤔",
    "😎",
    "🤣",
    "🥰",
    "😘",
    "💯",
    "🙌",
    "✨",
    "😱",
    "😆",
];

const ChatBox = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
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

    const currentUserId = currentUser?._id;

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const [message, setMessage] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] =
        useState(null);
    const [attachmentType, setAttachmentType] =
        useState(null);

    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] =
        useState(false);
    const [showHeaderMenu, setShowHeaderMenu] =
        useState(false);

    const [hoveredMessage, setHoveredMessage] =
        useState(null);
    const [activeMessageMenu, setActiveMessageMenu] =
        useState(null);

    const [menuPlacement, setMenuPlacement] =
        useState("top");
    const [reactionPlacement, setReactionPlacement] =
        useState("top");

    const [replyingTo, setReplyingTo] = useState(null);
    const [reactions, setReactions] = useState({});

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [messageToDelete, setMessageToDelete] =
        useState(null);

    useEffect(() => {
        const loadConversation = async () => {
            const token = await getToken();

            if (!token || !userId) return;

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
        if (!attachment) {
            setAttachmentPreview(null);
            return;
        }

        const preview = URL.createObjectURL(attachment);

        setAttachmentPreview(preview);

        return () => {
            URL.revokeObjectURL(preview);
        };
    }, [attachment]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedImage(null);
                setActiveMessageMenu(null);
                setShowHeaderMenu(false);
                setShowEmojiPicker(false);
                setShowAttachmentMenu(false);
                setMessageToDelete(null);
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = () => {
            setActiveMessageMenu(null);
            setShowHeaderMenu(false);
        };

        document.addEventListener(
            "click",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "click",
                handleOutsideClick
            );
        };
    }, []);

    const calculateMenuPosition = (event, type) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();

        const spaceAbove = rect.top;
        const spaceBelow =
            window.innerHeight - rect.bottom;

        if (type === "reaction") {
            setReactionPlacement(
                spaceBelow > 250
                    ? "bottom"
                    : "top"
            );
        }

        if (type === "menu") {
            setMenuPlacement(
                spaceBelow > 220
                    ? "bottom"
                    : "top"
            );
        }
    };

    const handleReactionButton = (event, msg) => {
        event.stopPropagation();

        const key = `reaction-${msg._id}`;

        calculateMenuPosition(
            event,
            "reaction"
        );

        setHoveredMessage(msg._id);

        setActiveMessageMenu(
            activeMessageMenu === key
                ? null
                : key
        );
    };

    const handleMoreButton = (event, msg) => {
        event.stopPropagation();

        calculateMenuPosition(
            event,
            "menu"
        );

        setHoveredMessage(msg._id);

        setActiveMessageMenu(
            activeMessageMenu === msg._id
                ? null
                : msg._id
        );
    };

    const handleReaction = (
        messageId,
        reaction
    ) => {
        setReactions((prev) => ({
            ...prev,
            [messageId]: reaction,
        }));

        setActiveMessageMenu(null);
    };

    const handleCopy = async (content) => {
        if (!content) return;

        try {
            await navigator.clipboard.writeText(
                content
            );
        } catch (error) {
            console.error(
                "Copy failed:",
                error
            );
        }

        setActiveMessageMenu(null);
    };

    const handleReply = (msg) => {
        setReplyingTo(msg);
        setActiveMessageMenu(null);
    };

    const handleDeleteMessage = (msg) => {
        setActiveMessageMenu(null);
        setMessageToDelete(msg);
    };

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;

        const token = await getToken();

        if (!token) return;

        const senderId =
            messageToDelete.senderId?._id ||
            messageToDelete.senderId;

        const isMine =
            String(senderId) ===
            String(currentUserId);

        if (isMine) {
            dispatch(
                deleteMessageForSender({
                    token,
                    messageId:
                        messageToDelete._id,
                })
            );
        } else {
            dispatch(
                deleteMessageForReceiver({
                    token,
                    messageId:
                        messageToDelete._id,
                })
            );
        }

        setMessageToDelete(null);
    };

    const handleReport = () => {
        setActiveMessageMenu(null);
        alert("Message reported.");
    };

    const handleFileChange = (
        event,
        type
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        setAttachment(file);
        setAttachmentType(type);
        setShowAttachmentMenu(false);

        event.target.value = "";
    };

    const removeAttachment = () => {
        setAttachment(null);
        setAttachmentPreview(null);
        setAttachmentType(null);
    };

    const handleSendMessage = async () => {
        if (
            !message.trim() &&
            !attachment
        ) {
            return;
        }

        const token = await getToken();

        if (!token) return;

        const formData = new FormData();

        if (message.trim()) {
            formData.append(
                "content",
                message.trim()
            );
        }

        if (attachment) {
            formData.append(
                "file",
                attachment
            );
        }

        formData.append(
            "receiverId",
            userId
        );

        formData.append(
            "messageType",
            attachmentType || "text"
        );

        await dispatch(
            sendNewMessage({
                token,
                messageData: formData,
            })
        );

        setMessage("");
        removeAttachment();
        setReplyingTo(null);
        setShowEmojiPicker(false);
    };

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const addEmoji = (emoji) => {
        setMessage(
            (prev) => prev + emoji
        );
    };

    const getSenderId = (msg) => {
        if (!msg?.senderId) {
            return null;
        }

        if (
            typeof msg.senderId ===
            "object"
        ) {
            return msg.senderId._id;
        }

        return msg.senderId;
    };

    const renderMessageContent = (msg) => {
        if (
            msg.messageType === "image"
        ) {
            return (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        setSelectedImage(
                            msg.content
                        );
                    }}
                    className="block cursor-zoom-in overflow-hidden rounded-xl"
                >
                    <img
                        src={msg.content}
                        alt="Message"
                        className="max-h-[320px] max-w-[280px] rounded-xl object-cover transition duration-200 hover:scale-[1.02]"
                    />
                </button>
            );
        }

        if (
            msg.messageType === "video"
        ) {
            return (
                <video
                    src={msg.content}
                    controls
                    className="max-h-[320px] max-w-[280px] rounded-xl"
                />
            );
        }

        if (
            msg.messageType === "file"
        ) {
            return (
                <a
                    href={msg.content}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-[#F3F7F5] px-3 py-2 text-sm text-[#183B3B] hover:bg-[#E8F0ED]"
                >
                    <File size={18} />
                    Open file
                </a>
            );
        }

        return (
            <p className="whitespace-pre-wrap break-words text-sm leading-5">
                {msg.content}
            </p>
        );
    };

    if (
        loading &&
        !selectedUser
    ) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-sm text-gray-500">
                    Loading conversation...
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-0 flex-col bg-white">

            {/* HEADER */}

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E4ECE9] px-4">

                <div className="flex min-w-0 items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="rounded-full p-2 text-gray-600 transition hover:bg-[#F3F7F5]"
                    >
                        <ArrowLeft
                            size={20}
                        />
                    </button>

                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#DDEAE6]">

                        {selectedUser?.profile_picture ? (
                            <img
                                src={
                                    selectedUser.profile_picture
                                }
                                alt={
                                    selectedUser.full_name
                                }
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#183B3B]">
                                {selectedUser?.full_name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">

                        <h2 className="truncate text-sm font-semibold text-[#183B3B]">
                            {selectedUser?.full_name ||
                                selectedUser?.username ||
                                "User"}
                        </h2>

                        <p className="truncate text-xs text-gray-500">
                            @
                            {
                                selectedUser?.username
                            }
                        </p>
                    </div>
                </div>

                <div className="relative">

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();

                            setShowHeaderMenu(
                                (prev) => !prev
                            );
                        }}
                        className="rounded-full p-2 text-gray-600 transition hover:bg-[#F3F7F5]"
                    >
                        <MoreVertical
                            size={20}
                        />
                    </button>

                    {showHeaderMenu && (
                        <div
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                            className="absolute right-0 top-11 z-[300] w-48 overflow-hidden rounded-xl border border-[#DCE8E5] bg-white py-1 shadow-xl"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setShowHeaderMenu(
                                        false
                                    )
                                }
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#F3F7F5]"
                            >
                                <FileText
                                    size={17}
                                />
                                View profile
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowHeaderMenu(
                                        false
                                    );
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
                            >
                                <Flag
                                    size={17}
                                />
                                Report user
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MESSAGES */}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">

                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">

                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F6F4] text-[#183B3B]">
                                <Smile
                                    size={25}
                                />
                            </div>

                            <p className="text-sm font-medium text-[#183B3B]">
                                Start a conversation
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Send a message to
                                get started.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {messages.map(
                            (msg) => {
                                const senderId =
                                    getSenderId(
                                        msg
                                    );

                                const isMine =
                                    String(
                                        senderId
                                    ) ===
                                    String(
                                        currentUserId
                                    );

                                const messageMenuOpen =
                                    activeMessageMenu ===
                                    msg._id;

                                const reactionMenuOpen =
                                    activeMessageMenu ===
                                    `reaction-${msg._id}`;

                                const menuOpen =
                                    messageMenuOpen ||
                                    reactionMenuOpen;

                                return (
                                    <div
                                        key={
                                            msg._id
                                        }
                                        className={`group flex ${
                                            isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                        onMouseEnter={() =>
                                            setHoveredMessage(
                                                msg._id
                                            )
                                        }
                                        onMouseLeave={() => {
                                            if (
                                                !menuOpen
                                            ) {
                                                setHoveredMessage(
                                                    null
                                                );
                                            }
                                        }}
                                    >

                                        <div
                                            className={`relative flex max-w-[80%] items-center gap-2 ${
                                                isMine
                                                    ? "flex-row-reverse"
                                                    : "flex-row"
                                            }`}
                                        >

                                            {/* MESSAGE BUBBLE */}

                                            <div
                                                className={`relative rounded-2xl px-3 py-2 ${
                                                    msg.messageType ===
                                                    "image"
                                                        ? "bg-transparent p-0"
                                                        : isMine
                                                        ? "bg-[#183B3B] text-white"
                                                        : "bg-[#F0F5F3] text-[#183B3B]"
                                                }`}
                                            >
                                                {renderMessageContent(
                                                    msg
                                                )}

                                                {reactions[
                                                    msg
                                                        ._id
                                                ] && (
                                                    <div
                                                        className={`absolute -bottom-3 ${
                                                            isMine
                                                                ? "left-1"
                                                                : "right-1"
                                                        } rounded-full border border-[#DCE8E5] bg-white px-1.5 py-0.5 text-xs shadow-sm`}
                                                    >
                                                        {
                                                            reactions[
                                                                msg
                                                                    ._id
                                                            ]
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            {/* ACTIONS */}

                                            {hoveredMessage ===
                                                msg._id && (
                                                <div
                                                    className={`absolute top-1/2 z-[80] flex -translate-y-1/2 items-center gap-1 rounded-xl border border-[#DCE8E5] bg-white p-1 shadow-lg ${
                                                        isMine
                                                            ? "right-full mr-2"
                                                            : "left-full ml-2"
                                                    }`}
                                                    onMouseEnter={() =>
                                                        setHoveredMessage(
                                                            msg._id
                                                        )
                                                    }
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReply(
                                                                msg
                                                            )
                                                        }
                                                        className="rounded-lg p-1.5 text-gray-600 transition hover:bg-[#F3F7F5]"
                                                        title="Reply"
                                                    >
                                                        <Reply
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(
                                                            event
                                                        ) =>
                                                            handleReactionButton(
                                                                event,
                                                                msg
                                                            )
                                                        }
                                                        className="rounded-lg p-1.5 text-gray-600 transition hover:bg-[#F3F7F5]"
                                                        title="React"
                                                    >
                                                        <Smile
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(
                                                            event
                                                        ) =>
                                                            handleMoreButton(
                                                                event,
                                                                msg
                                                            )
                                                        }
                                                        className="rounded-lg p-1.5 text-gray-600 transition hover:bg-[#F3F7F5]"
                                                        title="More"
                                                    >
                                                        <MoreVertical
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    {/* REACTIONS */}

                                                    {reactionMenuOpen && (
                                                        <div
                                                            className={`absolute left-1/2 z-[300] grid w-[220px] -translate-x-1/2 grid-cols-8 gap-1 rounded-xl border border-[#DCE8E5] bg-white p-2 shadow-2xl ${
                                                                reactionPlacement ===
                                                                "bottom"
                                                                    ? "top-full mt-2"
                                                                    : "bottom-full mb-2"
                                                            }`}
                                                            onClick={(
                                                                event
                                                            ) =>
                                                                event.stopPropagation()
                                                            }
                                                        >
                                                            {reactionsList.map(
                                                                (
                                                                    emoji
                                                                ) => (
                                                                    <button
                                                                        key={
                                                                            emoji
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleReaction(
                                                                                msg._id,
                                                                                emoji
                                                                            )
                                                                        }
                                                                        className="flex h-6 w-6 items-center justify-center rounded-md text-base transition hover:bg-[#F3F7F5]"
                                                                    >
                                                                        {
                                                                            emoji
                                                                        }
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* MORE MENU */}

                                                    {messageMenuOpen && (
                                                        <div
                                                            className={`absolute right-0 z-[300] w-48 overflow-hidden rounded-xl border border-[#DCE8E5] bg-white py-1 shadow-2xl ${
                                                                menuPlacement ===
                                                                "bottom"
                                                                    ? "top-full mt-2"
                                                                    : "bottom-full mb-2"
                                                            }`}
                                                            onClick={(
                                                                event
                                                            ) =>
                                                                event.stopPropagation()
                                                            }
                                                        >

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleReply(
                                                                        msg
                                                                    )
                                                                }
                                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#F3F7F5]"
                                                            >
                                                                <Reply
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                                Reply
                                                            </button>

                                                            {msg.messageType ===
                                                                "text" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCopy(
                                                                            msg.content
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#F3F7F5]"
                                                                >
                                                                    <Copy
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    Copy
                                                                </button>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteMessage(
                                                                        msg
                                                                    )
                                                                }
                                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                                Delete
                                                            </button>

                                                            {!isMine && (
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleReport
                                                                    }
                                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-[#F3F7F5]"
                                                                >
                                                                    <Flag
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    Report
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}

                        <div
                            ref={
                                messagesEndRef
                            }
                        />
                    </div>
                )}
            </div>

            {/* REPLY BAR */}

            {replyingTo && (
                <div className="shrink-0 border-t border-[#E4ECE9] bg-[#F8FBFA] px-4 py-2">

                    <div className="flex items-center justify-between gap-3">

                        <div className="min-w-0 border-l-2 border-[#8BB7A9] pl-3">

                            <p className="text-xs font-semibold text-[#183B3B]">
                                Replying to message
                            </p>

                            <p className="mt-0.5 truncate text-xs text-gray-500">
                                {replyingTo.messageType ===
                                "text"
                                    ? replyingTo.content
                                    : `Reply to ${replyingTo.messageType} message`}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setReplyingTo(
                                    null
                                )
                            }
                            className="rounded-full p-1.5 text-gray-500 transition hover:bg-[#EAF1EE]"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>
            )}

            {/* ATTACHMENT PREVIEW */}

            {attachment && (
                <div className="shrink-0 border-t border-[#E4ECE9] bg-white px-4 py-2">

                    <div className="relative inline-flex max-w-[240px] items-center gap-2 rounded-xl bg-[#F3F7F5] p-2">

                        {attachmentType ===
                            "image" &&
                            attachmentPreview && (
                                <img
                                    src={
                                        attachmentPreview
                                    }
                                    alt="Preview"
                                    className="h-16 w-16 rounded-lg object-cover"
                                />
                            )}

                        {attachmentType ===
                            "video" &&
                            attachmentPreview && (
                                <video
                                    src={
                                        attachmentPreview
                                    }
                                    className="h-16 w-16 rounded-lg object-cover"
                                />
                            )}

                        {attachmentType ===
                            "file" && (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white">
                                <FileText
                                    size={25}
                                />
                            </div>
                        )}

                        <div className="min-w-0 pr-5">

                            <p className="max-w-[130px] truncate text-xs font-medium text-[#183B3B]">
                                {
                                    attachment.name
                                }
                            </p>

                            <p className="text-[11px] text-gray-500">
                                {(
                                    attachment.size /
                                    1024 /
                                    1024
                                ).toFixed(
                                    2
                                )}{" "}
                                MB
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                removeAttachment
                            }
                            className="absolute right-1 top-1 rounded-full bg-white p-1 text-gray-500 shadow-sm transition hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* COMPOSER */}

            <div className="relative shrink-0 border-t border-[#E4ECE9] bg-white p-3">

                {showAttachmentMenu && (
                    <div className="absolute bottom-16 left-3 z-[200] w-48 overflow-hidden rounded-xl border border-[#DCE8E5] bg-white py-1 shadow-xl">

                        <button
                            type="button"
                            onClick={() =>
                                imageInputRef.current?.click()
                            }
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-[#F3F7F5]"
                        >
                            <ImageIcon
                                size={18}
                            />
                            Image
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                videoInputRef.current?.click()
                            }
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-[#F3F7F5]"
                        >
                            <Video size={18} />
                            Video
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-[#F3F7F5]"
                        >
                            <FileText
                                size={18}
                            />
                            File
                        </button>
                    </div>
                )}

                {showEmojiPicker && (
                    <div className="absolute bottom-16 right-3 z-[200] grid w-[280px] grid-cols-8 gap-1 rounded-xl border border-[#DCE8E5] bg-white p-3 shadow-xl">

                        {reactionsList.map(
                            (emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() =>
                                        addEmoji(
                                            emoji
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition hover:bg-[#F3F7F5]"
                                >
                                    {emoji}
                                </button>
                            )
                        )}
                    </div>
                )}

                <div className="flex items-end gap-2">

                    <button
                        type="button"
                        onClick={() => {
                            setShowAttachmentMenu(
                                (prev) =>
                                    !prev
                            );
                            setShowEmojiPicker(
                                false
                            );
                        }}
                        className="mb-1 rounded-full p-2 text-gray-500 transition hover:bg-[#F3F7F5] hover:text-[#183B3B]"
                    >
                        <Paperclip
                            size={20}
                        />
                    </button>

                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                            handleFileChange(
                                event,
                                "image"
                            )
                        }
                    />

                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(event) =>
                            handleFileChange(
                                event,
                                "video"
                            )
                        }
                    />

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(event) =>
                            handleFileChange(
                                event,
                                "file"
                            )
                        }
                    />

                    <div className="flex min-h-[44px] flex-1 items-end rounded-2xl border border-[#DCE8E5] bg-[#FAFCFB] px-3 py-2 focus-within:border-[#9EBDB2]">

                        <textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            placeholder="Write a message..."
                            rows={1}
                            className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-[#183B3B] outline-none placeholder:text-gray-400"
                        />

                        <button
                            type="button"
                            onClick={() => {
                                setShowEmojiPicker(
                                    (prev) =>
                                        !prev
                                );
                                setShowAttachmentMenu(
                                    false
                                );
                            }}
                            className="ml-2 rounded-full p-1.5 text-gray-500 transition hover:bg-[#F3F7F5] hover:text-[#183B3B]"
                        >
                            <Smile
                                size={19}
                            />
                        </button>
                    </div>

                    <button
                        type="button"
                        disabled={
                            sending ||
                            (!message.trim() &&
                                !attachment)
                        }
                        onClick={
                            handleSendMessage
                        }
                        className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#183B3B] text-white transition hover:bg-[#245252] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* DELETE CONFIRMATION */}

            {messageToDelete && (
                <div
                    className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
                    onClick={() =>
                        setMessageToDelete(
                            null
                        )
                    }
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="mb-4">

                            <h3 className="text-lg font-semibold text-[#183B3B]">
                                Delete message?
                            </h3>

                            <p className="mt-1 text-sm leading-5 text-gray-500">
                                Are you sure you
                                want to delete
                                this message? It
                                will be removed
                                from your chat.
                            </p>
                        </div>

                        {messageToDelete.messageType ===
                            "text" &&
                            messageToDelete.content && (
                                <div className="mb-5 rounded-xl bg-[#F3F7F5] px-3 py-2">

                                    <p className="line-clamp-2 text-sm text-gray-600">
                                        {
                                            messageToDelete.content
                                        }
                                    </p>
                                </div>
                            )}

                        <div className="flex justify-end gap-2">

                            <button
                                type="button"
                                onClick={() =>
                                    setMessageToDelete(
                                        null
                                    )
                                }
                                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-[#F3F7F5]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDeleteMessage
                                }
                                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* IMAGE VIEWER */}

            {selectedImage && (
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setSelectedImage(null)
                    }
                >

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();

                            setSelectedImage(
                                null
                            );
                        }}
                        className="absolute right-5 top-5 z-[1010] rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                    >
                        <X size={24} />
                    </button>

                    <img
                        src={selectedImage}
                        alt="Full size message"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

export default ChatBox;

