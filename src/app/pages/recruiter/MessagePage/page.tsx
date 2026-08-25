"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

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
  time: string;
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

  const [profile, setProfile] = useState<DeveloperProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
const [messagesLoading, setMessagesLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
 const { user} = useAuth();

 const recruter_name = user.name;
 const recruter_id = user.id;
  useEffect(() => {
    const fetchDeveloper = async () => {
      if (!developerId) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/developer_profile?userId=${developerId}`,
        );

        const data = await res.json();

        setProfile(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [developerId]);

  // Close emoji picker when clicking outside
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

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  // Emoji select
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  // Send message
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

  // Frontend console
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

    // Message successfully saved in database
   const newMessage: Message = {
  id: result.data?.id ?? Date.now(),
  sender: "me",
  senderId: recruter_id,
  text: trimmedMessage,
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

    setMessages((prev) => [...prev, newMessage]);

    // Clear input
    setMessage("");

    // Close emoji popup
    setShowEmojiPicker(false);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSend();
    }
  };

  useEffect(() => {
  const fetchMessages = async () => {
    if (!developer?.user_id || !user?.id) {
      return;
    }

    try {
      setMessagesLoading(true);

      const response = await fetch(
        `/api/conversations?userId=${user.id}&otherUserId=${developer.user_id}`,
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch messages:", result);
        return;
      }

      const formattedMessages: Message[] = (result.data || []).map(
        (item: any) => ({
          id: item.id,
          sender:
            String(item.senderId) === String(user.id)
              ? "me"
              : "them",
          senderId: item.senderId,
          text: item.message,
          time: new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      );

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  fetchMessages();
}, [developer?.user_id, user?.id]);
  return (
    <main className="min-h-screen w-full text-(--text)">
      <div className="mx-auto flex h-screen  flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border border-(--border) bg-(--surface) px-4 py-3 shadow-sm sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
          

            {/* User Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--primary) text-sm font-semibold text-white">
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
            </div>

            {/* User Info */}
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

         
        </div>

        {/* Message Area */}
        <section className="flex min-h-0 flex-1 flex-col border-x border-(--border) bg-(--bg-secondary)">
          {/* Conversation Info */}
          <div className="border-b border-(--border) px-5 py-3">
            <p className="text-center text-xs text-(--text-muted)">
              This conversation is between you and{" "}
              {developer?.fullName || "the developer"}.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
            {messages.map((item) => {
              const isMine = item.sender === "me";

              return (
                <div
                  key={item.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${
                      isMine ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isMine
                          ? "rounded-br-md bg-(--primary) text-white"
                          : "rounded-bl-md border border-(--border) bg-(--surface) text-(--text)"
                      }`}
                    >
                      {item.text}
                    </div>

                    <span className="mt-1.5 px-1 text-[11px] text-(--text-muted)">
                      {item.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Message Input */}
        <div className="rounded-b-2xl border border-(--border) bg-(--surface) p-3 shadow-sm sm:p-4">
          <div className="relative">
            {/* Emoji Popup */}
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
                  <span className="text-sm font-semibold">Emojis</span>

                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
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
                        hover:bg-(--surface-hover)
                        hover:scale-110
                      "
                      aria-label={`Select ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end gap-2 rounded-xl border border-(--border) bg-(--bg) p-2 transition focus-within:border-(--primary)">
              {/* Attachment */}
              <button
                type="button"
                className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--text-muted) transition hover:bg-(--surface-hover) hover:text-(--text)"
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
                className="max-h-32 min-h-9 flex-1 resize-none border-none bg-transparent px-2 py-2 text-sm text-(--text) outline-none placeholder:text-(--text-muted)"
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
                className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--primary) text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-40"
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
