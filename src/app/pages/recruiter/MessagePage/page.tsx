"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  MoreVertical,
  Paperclip,
  RefreshCw,
  Send,
  Smile,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface DeveloperProfileResponse {
  data: {
    user_id: number | string;
    developer_profile_id: number;
    title: string;
    availability: number;
    fullName: string;
    developer_photo: string;
    user_photo?: string;
  };
}

type Message = {
  id: number;
  sender: "me" | "them";
  senderId: string | number;
  text: string;
  createdAt: string;
  updatedAt?: string;
  edited?: number;
};

type SendMessageData = {
  receiverName: string;
  receiverId: string | number;
  senderName: string;
  senderId: string | number;
  message: string;
  createdAt: string;
};

const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😎",
  "🤩",
  "🤔",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😢",
  "😭",
  "😡",
  "🤬",
  "😱",
  "🤯",
  "😴",
  "🤝",
  "👍",
  "👎",
  "👏",
  "🙌",
  "🙏",
  "💪",
  "❤️",
  "💙",
  "💚",
  "💛",
  "🧡",
  "💜",
  "🖤",
  "🤍",
  "🔥",
  "✨",
  "🎉",
  "🚀",
  "💯",
  "⭐",
  "✅",
  "❌",
];

export default function MessagePage() {
  const searchParams = useSearchParams();

  const developerId = searchParams.get("developerId");

  const { user } = useAuth();

  const [profile, setProfile] = useState<DeveloperProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  /*
    Message container reference
    ---------------------------
    এই ref ব্যবহার করে last message-এ
    automatically scroll করা হবে।
  */
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const recruter_name = user?.name || "";
  const recruter_id = user?.id || "";

  /*
    --------------------------------------------------
    Relative Time Function
    --------------------------------------------------

    Example:

    Just now
    1 minute ago
    5 minutes ago
    1 hour ago
    3 hours ago
    1 day ago
    5 days ago
    2 weeks ago
    3 months ago
    1 year ago
  */

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const difference = now.getTime() - date.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 10) {
      return "Just now";
    }

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    if (days < 7) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    if (weeks < 4) {
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }

    if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }

    return `${years} ${years === 1 ? "year" : "years"} ago`;
  };

  /*
    --------------------------------------------------
    Fetch Developer Profile
    --------------------------------------------------
  */

  useEffect(() => {
    const fetchDeveloper = async () => {
      if (!developerId) return;

      console.log("developerId:", developerId);

      try {
        setLoading(true);

        const res = await fetch(`/api/developer_profile?userId=${developerId}`);

        const data = await res.json();

        setProfile(data);
      } catch (error) {
        console.log("Failed to fetch developer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [developerId]);

  /*
    --------------------------------------------------
    Close emoji picker when clicking outside
    --------------------------------------------------
  */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const developer = profile?.data;

  /*
    --------------------------------------------------
    Initials
    --------------------------------------------------
  */

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  /*
    --------------------------------------------------
    Scroll to bottom
    --------------------------------------------------
  */

  const scrollToBottom = (smooth = false) => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  /*
  --------------------------------------------------
  Mark Messages As Read
  --------------------------------------------------

  Current user = receiver
  Other user = sender

  অর্থাৎ developer → recruiter যেসব unread message
  পাঠিয়েছে, শুধু সেগুলো read = 1 হবে।
*/

  const markMessagesAsRead = async () => {
    if (!developer?.user_id || !user?.id) {
      return;
    }

    try {
      const response = await fetch("/api/conversations/read-to-unread", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId: user.id,
          otherUserId: developer.user_id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to mark messages as read:", result);

        return;
      }

      console.log("Messages marked as read:", result);
    } catch (error) {
      console.error("Mark messages as read error:", error);
    }
  };

  /*
    --------------------------------------------------
    Fetch Messages
    --------------------------------------------------
  */

  const fetchMessages = async (showLoader = true) => {
    if (!developer?.user_id || !user?.id) {
      return;
    }

    try {
      if (showLoader) {
        setMessagesLoading(true);
      }

      const response = await fetch(
        `/api/conversations?userId=${user.id}&otherUserId=${developer.user_id}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch messages:", result);
        return;
      }

      const formattedMessages: Message[] = (result.data || []).map(
        (item: any) => ({
          id: item.id,

          sender: String(item.senderId) === String(user.id) ? "me" : "them",

          senderId: item.senderId,

          text: item.message,

          createdAt: item.createdAt,

          updatedAt: item.updatedAt,

          edited: item.edited ?? 0,
        }),
      );

      setMessages(formattedMessages);

      /*
      Messages successfully load হওয়ার পরে
      এই conversation-এর incoming unread messages
      read = 1 করে দিচ্ছি।
    */

      await markMessagesAsRead();
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
    } finally {
      if (showLoader) {
        setMessagesLoading(false);
      }
    }
  };

  /*
    --------------------------------------------------
    Initial message fetch
    --------------------------------------------------
  */

  useEffect(() => {
    fetchMessages(true);
  }, [developer?.user_id, user?.id]);

  /*
    --------------------------------------------------
    Automatically scroll to last message
    যখন messages load/update হবে
    --------------------------------------------------
  */

  useEffect(() => {
    if (messages.length === 0) return;

    /*
      DOM update হওয়ার পরে scroll করার জন্য
      setTimeout ব্যবহার করছি।
    */

    const timer = setTimeout(() => {
      scrollToBottom(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [messages]);

  /*
    --------------------------------------------------
    Refresh Button
    --------------------------------------------------

    Button click করলে:
    1. API call হবে
    2. নতুন messages আসবে
    3. Last message-এ scroll হবে
    --------------------------------------------------
  */

  const handleRefresh = async () => {
    if (!developer?.user_id || !user?.id) return;

    try {
      setRefreshing(true);

      await fetchMessages(false);

      /*
        API data state update হওয়ার পরে
        scroll করার জন্য ছোট delay।
      */

      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  /*
    --------------------------------------------------
    Emoji select
    --------------------------------------------------
  */

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  /*
  --------------------------------------------------
  Start Editing Message
  --------------------------------------------------
*/

  const handleStartEdit = (item: Message) => {
    setEditingMessageId(item.id);
    setEditingText(item.text);
    setShowEmojiPicker(false);
  };

  /*
  --------------------------------------------------
  Cancel Editing
  --------------------------------------------------
*/

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  /*
  --------------------------------------------------
  Save Edited Message
  --------------------------------------------------
*/

  const handleSaveEdit = async () => {
    const trimmedText = editingText.trim();

    if (!trimmedText) return;

    if (editingMessageId === null) return;

    if (!user?.id) {
      console.error("User information not available");
      return;
    }

    try {
      const response = await fetch("/api/conversations/edit", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messageId: editingMessageId,
          userId: user.id,
          message: trimmedText,
        }),
      });

      const result = await response.json();

      console.log("EDIT MESSAGE API RESPONSE:", result);

      if (!response.ok) {
        console.error("Message edit failed:", result);
        return;
      }

      const updatedMessage = result.data;

      setMessages((prev) =>
        prev.map((item) =>
          item.id === editingMessageId
            ? {
                ...item,
                text: updatedMessage.message,
                createdAt: updatedMessage.createdAt,
                updatedAt: updatedMessage.updatedAt,
                edited: updatedMessage.edited,
              }
            : item,
        ),
      );

      setEditingMessageId(null);
      setEditingText("");
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };
  /*
    --------------------------------------------------
    Send Message
    --------------------------------------------------
  */

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    if (!developer) {
      console.log("Developer information not available");
      return;
    }

    if (!user) {
      console.log("Sender information not available");
      return;
    }

    const messageData: SendMessageData = {
      receiverName: developer.fullName,
      receiverId: developer.user_id,

      senderName: recruter_name,
      senderId: recruter_id,

      message: trimmedMessage,

      createdAt: new Date().toISOString(),
    };

    console.log("MESSAGE DATA:", messageData);

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          receiverName: developer.fullName,
          receiverId: developer.user_id,

          senderName: recruter_name,
          senderId: recruter_id,

          message: trimmedMessage,
        }),
      });

      const result = await response.json();

      console.log("API RESPONSE:", result);

      if (!response.ok) {
        console.error("Message sending failed:", result);
        return;
      }

      /*
        নতুন message locally add করছি।
        এতে refresh না করেও message সাথে সাথে দেখা যাবে।
      */

      const newMessage: Message = {
        id: result.data?.id ?? Date.now(),

        sender: "me",

        senderId: recruter_id,

        text: trimmedMessage,

        createdAt: result.data?.createdAt ?? new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      setMessage("");

      setShowEmojiPicker(false);

      /*
        নতুন message-এর পরে bottom-এ scroll
      */

      setTimeout(() => {
        scrollToBottom(true);
      }, 50);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /*
    --------------------------------------------------
    Enter → Send
    --------------------------------------------------
  */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSend();
    }
  };

  return (
    <main className="min-h-screen w-full text-(--text)">
      <div className="mx-auto flex h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-t-2xl
            border
            border-(--border)
            bg-(--surface)
            px-4
            py-3
            shadow-sm
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Developer Avatar */}

            <div className="relative shrink-0">
              <Link href={`/pages/recruiter/developer_profile_details/${developerId}`}>
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-(--primary)
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {developer?.developer_photo || developer?.user_photo ? (
                  <Image
                    src={developer.developer_photo || developer.user_photo!}
                    alt={developer.fullName || "Developer"}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {developer?.fullName
                      ? getInitials(developer.fullName)
                      : "??"}
                  </span>
                )}
              </div>
              </Link>
              
            </div>

            {/* Developer Info */}

            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold sm:text-base">
                {developer?.fullName}
              </h1>

              <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                {developer?.title} •{" "}
                {developer?.availability === 1
                  ? "Available for work"
                  : "Not available for work"}
              </p>
            </div>
          </div>

          {/* Header Actions */}

          <div className="flex items-center gap-1">
            {/* Refresh */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || messagesLoading}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-(--text-muted)
                transition
                hover:bg-(--surface-hover)
                hover:text-(--text)
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              aria-label="Refresh messages"
              title="Refresh messages"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* =====================================================
            MESSAGE AREA
        ====================================================== */}

        <section
          className="
            flex
            min-h-0
            flex-1
            flex-col
            border-x
            border-(--border)
            bg-(--bg-secondary)
          "
        >
          {/* Conversation Info */}

          <div className="border-b border-(--border) px-5 py-3">
            <p className="text-center text-xs text-(--text-muted)">
              This conversation is between you and{" "}
              {developer?.fullName || "the developer"}.
            </p>
          </div>

          {/* Messages */}

          <div
            ref={messagesContainerRef}
            className="
              flex-1
              space-y-5
              overflow-y-auto
              px-4
              py-6
              sm:px-6
            "
          >
            {messagesLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-(--text-muted)">
                  Loading messages...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-(--text-muted)">No messages yet.</p>
              </div>
            ) : (
              messages.map((item) => {
                const isMine = item.sender === "me";
                const isEditing = editingMessageId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${
                        isMine ? "items-end" : "items-start"
                      }`}
                    >
                      {isEditing ? (
                        /*
            --------------------------------------------------
            Editing Mode
            --------------------------------------------------
          */
                        <div className="w-full min-w-[280px] max-w-[500px] rounded-2xl border border-(--primary) bg-(--surface) p-3 shadow-sm">
                          <textarea
                            autoFocus
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.preventDefault();
                                handleCancelEdit();
                              }

                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveEdit();
                              }
                            }}
                            rows={3}
                            className="
                w-full
                resize-none
                rounded-lg
                border-none
                bg-transparent
                px-1
                py-1
                text-sm
                leading-6
                text-(--text)
                outline-none
                placeholder:text-(--text-muted)
              "
                            placeholder="Edit your message..."
                          />

                          <div className="mt-2 flex items-center justify-end gap-2 border-t border-(--border) pt-2">
                            {/* Cancel */}

                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="
                  inline-flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  px-3
                  text-xs
                  font-medium
                  text-(--text-muted)
                  transition
                  hover:bg-(--surface-hover)
                  hover:text-(--text)
                "
                            >
                              <X size={14} />
                              Cancel
                            </button>

                            {/* Save */}

                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              disabled={!editingText.trim()}
                              className="
                  inline-flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-(--primary)
                  px-3
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:bg-(--primary-hover)
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                            >
                              <Check size={14} />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Normal Message Row */}

                          <div className="flex items-end gap-1.5">
                            {/* Message Bubble */}

                            <div
                              className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                isMine
                                  ? "rounded-br-md bg-(--primary) text-white"
                                  : "rounded-bl-md border border-(--border) bg-(--surface) text-(--text)"
                              }`}
                            >
                              {item.text}
                            </div>

                            {/* Edit Button */}

                            {isMine && (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(item)}
                                className="
                    mb-1
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    text-(--text-muted)
                    transition
                    hover:bg-(--surface-hover)
                    hover:text-(--primary)
                  "
                                aria-label="Edit message"
                                title="Edit message"
                              >
                                <Edit3 size={14} />
                              </button>
                            )}
                          </div>

                          {/* Message Time */}

                          <span
                            className="
                mt-1.5
                px-1
                text-[11px]
                text-(--text-muted)
              "
                            title={new Date(
                              item.updatedAt || item.createdAt,
                            ).toLocaleString()}
                          >
                            {getRelativeTime(item.updatedAt || item.createdAt)}

                            {item.edited === 1 && (
                              <span className="ml-1.5">· edited</span>
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* =====================================================
            MESSAGE INPUT
        ====================================================== */}

        <div
          className="
            rounded-b-2xl
            border
            border-(--border)
            bg-(--surface)
            p-3
            shadow-sm
            sm:p-4
          "
        >
          <div className="relative">
            {/* =================================================
                EMOJI POPUP
            ================================================== */}

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="
                  absolute
                  bottom-14
                  right-12
                  z-50
                  w-72
                  rounded-2xl
                  border
                  border-(--border)
                  bg-(--surface)
                  p-3
                  shadow-(--shadow)
                "
              >
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    border-b
                    border-(--border)
                    pb-2
                  "
                >
                  <span className="text-sm font-semibold">Emojis</span>

                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="
                      text-xs
                      text-(--text-muted)
                      hover:text-(--text)
                    "
                  >
                    Close
                  </button>
                </div>

                <div
                  className="
                    grid
                    max-h-56
                    grid-cols-8
                    gap-1
                    overflow-y-auto
                  "
                >
                  {emojis.map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-xl
                        transition
                        hover:scale-110
                        hover:bg-(--surface-hover)
                      "
                      aria-label={`Select ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}

            <div
              className="
                flex
                items-end
                gap-2
                rounded-xl
                border
                border-(--border)
                bg-(--bg)
                p-2
                transition
                focus-within:border-(--primary)
              "
            >
              {/* Attachment */}

              <button
                type="button"
                className="
                  mb-1
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-(--text-muted)
                  transition
                  hover:bg-(--surface-hover)
                  hover:text-(--text)
                "
                aria-label="Attach file"
              >
                <Paperclip size={18} />
              </button>

              {/* Text Input */}

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                rows={1}
                className="
                  max-h-32
                  min-h-9
                  flex-1
                  resize-none
                  border-none
                  bg-transparent
                  px-2
                  py-2
                  text-sm
                  text-(--text)
                  outline-none
                  placeholder:text-(--text-muted)
                "
              />

              {/* Emoji */}

              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`
                  mb-1
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  transition
                  ${
                    showEmojiPicker
                      ? "bg-(--surface-hover) text-(--primary)"
                      : "text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text)"
                  }
                `}
                aria-label="Add emoji"
              >
                <Smile size={18} />
              </button>

              {/* Send */}

              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim()}
                className="
                  mb-1
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-(--primary)
                  text-white
                  transition
                  hover:bg-(--primary-hover)
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </div>
          </div>

          <p className="mt-2 hidden text-[11px] text-(--text-muted) sm:block">
            Press Enter to send • Shift + Enter for a new line
          </p>
        </div>
      </div>
    </main>
  );
}
