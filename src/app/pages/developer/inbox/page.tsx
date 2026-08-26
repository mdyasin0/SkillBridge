"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Conversation {
  conversationId: string;

  /*
    Current logged-in Developer
  */
  receiverId: string | number;

  /*
    Opposite user / Recruiter
  */
  otherUserId: string | number;
  otherUserName: string;

  recruiterPhoto?: string | null;

  lastMessage: string;
  lastMessageAt: string;

  lastMessageId: number;

  read: number;
  edited: number;

  unreadCount: number;
}

export default function MessageDeveloperList() {
  const router = useRouter();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        const response = await fetch(
          `/api/developer_site_conversation?userId=${user.id}`,
          {
            cache: "no-store",
          },
        );

        const result = await response.json();

        console.log("DEVELOPER CONVERSATIONS:", result);

        if (!response.ok) {
          console.error("Failed to fetch conversations:", result);
          return;
        }

        setConversations(result.data || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  /*
    --------------------------------------------------
    Conversation click
    --------------------------------------------------

    recruiterId = opposite user / Recruiter

    receiverId = current Developer

    MessagePage এই দুইটা ID ব্যবহার করবে
    unread message read করার জন্য।
  */

  const handleConversationClick = (conversation: Conversation) => {
    /*
      receiverId না থাকলে MessagePage-এ পাঠাবো না।

      কারণ read API-এর জন্য receiverId প্রয়োজন।
    */

    if (!conversation.receiverId) {
      console.error(
        "Cannot open conversation: receiverId is missing",
        conversation,
      );

      return;
    }

    /*
      Recruiter ID-ও অবশ্যই থাকতে হবে।
    */

    if (!conversation.otherUserId) {
      console.error(
        "Cannot open conversation: recruiterId is missing",
        conversation,
      );

      return;
    }

    /*
      দুইটা ID MessagePage-এ পাঠাচ্ছি।

      recruiterId = Recruiter
      receiverId = Developer
    */

    router.push(
      `/pages/developer/MessagePage?recruiterId=${conversation.otherUserId}&receiverId=${conversation.receiverId}`,
    );
  };

  /*
    --------------------------------------------------
    Loading
    --------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-4 text-sm text-(--text-muted)">
        Loading conversations...
      </div>
    );
  }

  /*
    --------------------------------------------------
    No conversations
    --------------------------------------------------
  */

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-(--text-muted)">
        No conversations yet.
      </div>
    );
  }

  /*
    --------------------------------------------------
    Conversation list
    --------------------------------------------------
  */

  return (
    <div className="w-full">
      {conversations.map((conversation) => {
        const initials = conversation.otherUserName
          ?.trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((word) => word.charAt(0).toUpperCase())
          .join("");

        return (
          <button
            key={conversation.conversationId}
            type="button"
            onClick={() => handleConversationClick(conversation)}
            className="
              flex
              w-full
              items-center
              gap-3
              border-b
              border-(--border)
              px-4
              py-3
              text-left
              transition
              hover:bg-(--surface-hover)
            "
          >
            {/* Recruiter Image */}

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
              {conversation.recruiterPhoto ? (
                <Image
                  src={conversation.recruiterPhoto}
                  alt={conversation.otherUserName || "Recruiter"}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials || "U"}</span>
              )}
            </div>

            {/* Recruiter Name + Last Message + Indicator */}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`truncate text-sm ${
                    conversation.unreadCount > 0
                      ? "font-bold text-(--text)"
                      : "font-semibold text-(--text)"
                  }`}
                >
                  {conversation.otherUserName}
                </p>

                {/* Unread Count */}

                {conversation.unreadCount > 0 && (
                  <span
                    className="
                      flex
                      h-5
                      min-w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-(--primary)
                      px-1.5
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {conversation.unreadCount > 99
                      ? "99+"
                      : conversation.unreadCount}
                  </span>
                )}
              </div>

              <p
                className={`mt-0.5 truncate text-xs ${
                  conversation.unreadCount > 0
                    ? "font-medium text-(--text)"
                    : "text-(--text-muted)"
                }`}
              >
                {conversation.lastMessage}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}