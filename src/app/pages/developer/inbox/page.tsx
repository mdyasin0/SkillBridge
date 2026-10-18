
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingUI from "@/components/Loadinui";
import { toast } from "react-toastify";

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

        if (!response.ok) {
          toast.error(result);
          return;
        }

        setConversations(result.data || []);
      } catch (error) {
        toast.error(String(error));
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

    these 2 id will be used in MessagePage  for
    unread message read
  */

  const handleConversationClick = (conversation: Conversation) => {
    /*
      if no receiverId  not redirect in  MessagePage

      because for read API receiverId is needed .
    */

    if (!conversation.receiverId) {
      toast.error(String(conversation));

      return;
    }

    /*
      Recruiter ID- must need
    */

    if (!conversation.otherUserId) {
      toast.error(String(conversation));

      return;
    }

    /*
      2 ID return in MessagePage .

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
    return <LoadingUI />;
  }

  /*
    --------------------------------------------------
    No conversations
    --------------------------------------------------
  */

  if (conversations.length === 0) {
    return (
      <div className="w-full p-4 text-center text-sm text-(--text-muted) sm:p-6">
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
    <div className="w-full min-w-0 overflow-hidden rounded-lg bg-(--surface)">
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
              min-w-0
              items-center
              gap-3
              border-b
              border-(--border)
              bg-(--surface)
              px-3
              py-3
              text-left
              transition-colors
              duration-200
              hover:bg-(--surface-hover)
              focus-visible:outline-2
              focus-visible:outline-offset-[-2px]
              focus-visible:outline-(--primary)
              sm:gap-3
              sm:px-4
              sm:py-3.5
            "
          >
            {/* Recruiter Image */}

            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-(--primary)
                text-sm
                font-semibold
                text-white
                sm:size-11
              "
            >
              {conversation.recruiterPhoto ? (
                <Image
                  src={conversation.recruiterPhoto}
                  alt={conversation.otherUserName || "Recruiter"}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 640px) 40px, 44px"
                />
              ) : (
                <span>{initials || "U"}</span>
              )}
            </div>

            {/* Recruiter Name + Last Message + Indicator */}

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <p
                  className={`min-w-0 flex-1 truncate text-sm ${
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
                className={`mt-0.5 truncate text-xs leading-5 ${
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
