"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Conversation {
  id: number;
  conversationId: string;

  receiverName: string;
  receiverId: string | number;

  developerId?: string | number;
  developerPhoto?: string | null;

  senderName: string;
  senderId: string | number;

  message: string;

  createdAt: string;
  updatedAt: string;

  read: number;
  edited: number;

  /*
    নতুন field
  */
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
          `/api/conversations?userId=${user.id}`,
        );

        const result = await response.json();

        console.log("CONVERSATIONS:", result);

        if (!response.ok) {
          console.error(
            "Failed to fetch conversations:",
            result,
          );

          return;
        }

        setConversations(result.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch conversations:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  /*
  ==================================================
  Current user বাদ দিয়ে developer বের করা
  ==================================================
  */

  const getDeveloperInfo = (
    conversation: Conversation,
  ) => {
    const currentUserId = String(user?.id);

    if (
      String(conversation.senderId) === currentUserId
    ) {
      return {
        id: conversation.receiverId,
        name: conversation.receiverName,
        developerPhoto:
          conversation.developerPhoto,
      };
    }

    return {
      id: conversation.senderId,
      name: conversation.senderName,
      developerPhoto:
        conversation.developerPhoto,
    };
  };

  /*
  ==================================================
  Conversation click
  ==================================================
  */

  const handleDeveloperClick = (
    conversation: Conversation,
  ) => {
    const developer =
      getDeveloperInfo(conversation);

    router.push(
      `/pages/recruiter/MessagePage?developerId=${developer.id}`,
    );
  };

  /*
  ==================================================
  Loading
  ==================================================
  */

  if (loading) {
    return (
      <div className="p-4 text-sm text-(--text-muted)">
        Loading conversations...
      </div>
    );
  }

  /*
  ==================================================
  Empty
  ==================================================
  */

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-(--text-muted)">
        No conversations yet.
      </div>
    );
  }

  /*
  ==================================================
  Inbox
  ==================================================
  */

  return (
    <div className="w-full">
      {conversations.map((conversation) => {
        const developer =
          getDeveloperInfo(conversation);

        const unreadCount =
          Number(conversation.unreadCount) || 0;

        return (
          <button
            key={conversation.conversationId}
            type="button"
            onClick={() =>
              handleDeveloperClick(conversation)
            }
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
            {/* ==========================================
                Developer Image
            ========================================== */}

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
              {developer.developerPhoto ? (
                <Image
                  src={developer.developerPhoto}
                  alt={
                    developer.name ||
                    "Developer"
                  }
                  width={44}
                  height={44}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                <span>
                  {developer.name
                    ?.trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) =>
                      word
                        .charAt(0)
                        .toUpperCase(),
                    )
                    .join("")}
                </span>
              )}
            </div>

            {/* ==========================================
                Developer Info
            ========================================== */}

            <div className="min-w-0 flex-1">
              {/* Name + unread badge */}

              <div className="flex items-center gap-2">
                <p
                  className={`
                    min-w-0
                    flex-1
                    truncate
                    text-sm
                    ${
                      unreadCount > 0
                        ? "font-bold text-(--text)"
                        : "font-semibold text-(--text)"
                    }
                  `}
                >
                  {developer.name}
                </p>

                {/* ======================================
                    Unread Count
                ====================================== */}

                {unreadCount > 0 && (
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
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </div>

              {/* Last Message */}

              <p
                className={`
                  mt-0.5
                  truncate
                  text-xs
                  ${
                    unreadCount > 0
                      ? "font-medium text-(--text)"
                      : "text-(--text-muted)"
                  }
                `}
              >
                {conversation.message}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}