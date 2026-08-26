"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Paperclip,
  RefreshCw,
  Send,
  Smile,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface DeveloperProfileResponse {
  data: {
    user_id: number | string;
    fullName: string;
    profilePhoto: string;
    companyName: string;
  };
}

type Message = {
  id: number;
  sender: "me" | "them";
  senderId: string | number;
  text: string;
  createdAt: string;
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

  const recruiterId = searchParams.get("recruiterId");

  console.log("RECRUITER ID FROM URL:", recruiterId);

  const [profile, setProfile] =
    useState<DeveloperProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  /*
    Message list-এর একদম শেষে এই element থাকবে।
    এটাতে scroll করলে automatically last message-এ চলে যাবে।
  */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const developer_name = user?.name;
  const developer_id = user?.id;



/*
|--------------------------------------------------------------------------
| Mark Recruiter Messages as Read
|--------------------------------------------------------------------------
|
| Current user = Developer / Receiver
| recruiterId = Recruiter / Sender
|
| Conversation page enter করলেই:
|
| Recruiter → Developer
| read = 0
|
| messageগুলো:
|
| read = 1
|
*/

const markMessagesAsRead = useCallback(async () => {
  if (!user?.id || !recruiterId) {
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
        otherUserId: recruiterId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Failed to mark messages as read:",
        result,
      );

      return;
    }

    console.log("Messages marked as read:", result);
  } catch (error) {
    console.error(
      "Mark messages as read error:",
      error,
    );
  }
}, [user?.id, recruiterId]);

  /*
  |--------------------------------------------------------------------------
  | Recruiter Profile
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchRecruiter = async () => {
      if (!recruiterId) return;

      try {
        setLoading(true);

        const res = await fetch(
          `/api/recruiter_profile_info?userId=${recruiterId}`,
        );

        const data = await res.json();

        console.log("RECRUITER PROFILE:", data);

        if (!res.ok) {
          console.error("Failed to fetch recruiter profile:", data);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch recruiter:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiter();
  }, [recruiterId]);

  /*
  |--------------------------------------------------------------------------
  | Close Emoji Picker
  |--------------------------------------------------------------------------
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

  const recruiter = profile?.data;

  /*
  |--------------------------------------------------------------------------
  | Initials
  |--------------------------------------------------------------------------
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
  |--------------------------------------------------------------------------
  | Relative Time
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | Just now
  | 1 minute ago
  | 5 minutes ago
  | 1 hour ago
  | 3 hours ago
  | 1 day ago
  | 5 days ago
  | 2 weeks ago
  | 3 months ago
  | 1 year ago
  |
  */

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now.getTime() - date.getTime()) / 1000,
    );

    if (diffInSeconds < 10) {
      return "Just now";
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours} ${
        diffInHours === 1 ? "hour" : "hours"
      } ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
      return `${diffInDays} ${
        diffInDays === 1 ? "day" : "days"
      } ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${
        diffInWeeks === 1 ? "week" : "weeks"
      } ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths < 12) {
      return `${diffInMonths} ${
        diffInMonths === 1 ? "month" : "months"
      } ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);

    return `${diffInYears} ${
      diffInYears === 1 ? "year" : "years"
    } ago`;
  };

  /*
  |--------------------------------------------------------------------------
  | Relative Time Refresh
  |--------------------------------------------------------------------------
  |
  | প্রতি 30 second পরপর component update হবে।
  | ফলে "59 seconds ago" → "1 minute ago"
  | automatically change হবে।
  |
  */

  const [, setTimeTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Scroll To Bottom
  |--------------------------------------------------------------------------
  */

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior,
          block: "end",
        });
      }, 50);
    },
    [],
  );

  /*
  |--------------------------------------------------------------------------
  | Fetch Messages
  |--------------------------------------------------------------------------
  |
  | এই function দুই জায়গা থেকে ব্যবহার হবে:
  |
  | 1. Page প্রথম load হওয়ার সময়
  | 2. Refresh button click করলে
  |
  */

  const fetchMessages = useCallback(
    async (isRefresh = false) => {
      if (!recruiter?.user_id || !user?.id) {
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setMessagesLoading(true);
        }

        const response = await fetch(
          `/api/conversations?userId=${user.id}&otherUserId=${recruiter.user_id}`,
          {
            cache: "no-store",
          },
        );

        const result = await response.json();

        console.log("MESSAGES RESPONSE:", result);

        if (!response.ok) {
          console.error("Failed to fetch messages:", result);
          return;
        }

        const formattedMessages: Message[] = (
          result.data || []
        ).map((item: any) => ({
          id: item.id,

          sender:
            String(item.senderId) === String(user.id)
              ? "me"
              : "them",

          senderId: item.senderId,

          text: item.message,

          createdAt: item.createdAt,
        }));

        setMessages(formattedMessages);

        /*
          Message load হওয়ার পরে last message-এ যাবে।
        */
        setTimeout(() => {
          scrollToBottom(isRefresh ? "smooth" : "auto");
        }, 100);
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
      } finally {
        setMessagesLoading(false);
        setRefreshing(false);
      }
    },
    [recruiter?.user_id, user?.id, scrollToBottom],
  );

  /*
  |--------------------------------------------------------------------------
  | Initial Message Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchMessages(false);
  }, [fetchMessages]);


  /*
|--------------------------------------------------------------------------
| Conversation Enter → Mark Received Messages as Read
|--------------------------------------------------------------------------
*/

useEffect(() => {
  if (!user?.id || !recruiterId) {
    return;
  }

  markMessagesAsRead();
}, [user?.id, recruiterId, markMessagesAsRead]);
  /*
  |--------------------------------------------------------------------------
  | যখন messages state change হবে,
  | তখন last message-এ scroll করবে।
  |
  | বিশেষ করে নতুন message send করার পর এটা কাজ করবে।
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages.length, scrollToBottom]);

  /*
  |--------------------------------------------------------------------------
  | Emoji Select
  |--------------------------------------------------------------------------
  */

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  /*
  |--------------------------------------------------------------------------
  | Send Message
  |--------------------------------------------------------------------------
  */

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    if (!recruiter) {
      console.log("Recruiter information not available");
      return;
    }

    if (!user) {
      console.log("Sender information not available");
      return;
    }

    const messageData: SendMessageData = {
      receiverName: recruiter.fullName,
      receiverId: recruiter.user_id,

      senderName: developer_name,
      senderId: developer_id,

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
          receiverName: recruiter.fullName,
          receiverId: recruiter.user_id,

          senderName: developer_name,
          senderId: developer_id,

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
        Message database-এ successfully save হওয়ার পর
        frontend-এ immediately add করছি।
      */

      const newMessage: Message = {
        id: result.data?.id ?? Date.now(),

        sender: "me",

        senderId: developer_id,

        text: trimmedMessage,

        createdAt:
          result.data?.createdAt ??
          new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      setMessage("");

      setShowEmojiPicker(false);

      /*
        Send করার পর অবশ্যই last message-এ যাবে।
      */
      scrollToBottom("smooth");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Enter → Send
  |--------------------------------------------------------------------------
  */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSend();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading Profile
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-(--text-muted)">
        Loading recruiter...
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full text-(--text)">
      <div className="mx-auto flex h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">

        {/* =========================================================
            Header
        ========================================================== */}

        <div className="flex items-center justify-between rounded-t-2xl border border-(--border) bg-(--surface) px-4 py-3 shadow-sm sm:px-5">

          <div className="flex min-w-0 items-center gap-3">

            {/* Recruiter Avatar */}

            <div className="relative shrink-0">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--primary) text-sm font-semibold text-white">

                {recruiter?.profilePhoto ? (
                  <Image
                    src={recruiter.profilePhoto}
                    alt={recruiter.fullName || "Recruiter"}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {recruiter?.fullName
                      ? getInitials(recruiter.fullName)
                      : "??"}
                  </span>
                )}

              </div>

            </div>

            {/* Recruiter Info */}

            <div className="min-w-0">

              <h1 className="truncate text-sm font-semibold sm:text-base">
                Recruiter name: {recruiter?.fullName}
              </h1>

              <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                Company: {recruiter?.companyName}
              </p>

            </div>

          </div>

          {/* Refresh Button */}

          <button
            type="button"
            onClick={() => fetchMessages(true)}
            disabled={refreshing || messagesLoading}
            className="
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

        {/* =========================================================
            Message Area
        ========================================================== */}

        <section className="flex min-h-0 flex-1 flex-col border-x border-(--border) bg-(--bg-secondary)">

          {/* Conversation Info */}

          <div className="border-b border-(--border) px-5 py-3">

            <p className="text-center text-xs text-(--text-muted)">
              This conversation is between you and{" "}
              {recruiter?.fullName || "the recruiter"}.
            </p>

          </div>

          {/* =====================================================
              Messages
          ====================================================== */}

          <div
            className="
              flex-1
              space-y-5
              overflow-y-auto
              px-4
              py-6
              sm:px-6
            "
          >

            {/* Message Loading */}

            {messagesLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-(--text-muted)">
                  Loading messages...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-(--text-muted)">
                  No messages yet.
                </p>
              </div>
            ) : (
              <>
                {messages.map((item) => {

                  const isMine = item.sender === "me";

                  return (
                    <div
                      key={item.id}
                      className={`flex ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${
                          isMine
                            ? "items-end"
                            : "items-start"
                        }`}
                      >

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

                        {/* Relative Time */}

                        <span className="mt-1.5 px-1 text-[11px] text-(--text-muted)">
                          {getRelativeTime(item.createdAt)}
                        </span>

                      </div>

                    </div>
                  );
                })}

                {/* 
                  এই invisible element সব message-এর শেষে।
                  এখানে scroll করলেই last message-এ চলে যাবে।
                */}

                <div ref={messagesEndRef} />

              </>
            )}

          </div>
        </section>

        {/* =========================================================
            Message Input
        ========================================================== */}

        <div className="rounded-b-2xl border border-(--border) bg-(--surface) p-3 shadow-sm sm:p-4">

          <div className="relative">

            {/* =====================================================
                Emoji Popup
            ====================================================== */}

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
                  shadow-[var(--shadow)]
                "
              >

                <div className="mb-2 flex items-center justify-between border-b border-(--border) pb-2">

                  <span className="text-sm font-semibold">
                    Emojis
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setShowEmojiPicker(false)
                    }
                    className="text-xs text-(--text-muted) hover:text-(--text)"
                  >
                    Close
                  </button>

                </div>

                <div className="grid max-h-56 grid-cols-8 gap-1 overflow-y-auto">

                  {emojis.map((emoji, index) => (
                    <button
                      key={`${emoji}-${index}`}
                      type="button"
                      onClick={() =>
                        handleEmojiSelect(emoji)
                      }
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

            {/* =====================================================
                Input
            ====================================================== */}

            <div className="flex items-end gap-2 rounded-xl border border-(--border) bg-(--bg) p-2 transition focus-within:border-(--primary)">

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

              {/* Textarea */}

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
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
                onClick={() =>
                  setShowEmojiPicker((prev) => !prev)
                }
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