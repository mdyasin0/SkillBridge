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
  developerPhoto?: string | null;
  senderName: string;
  senderId: string | number;

  message: string;

  createdAt: string;
  updatedAt: string;

  read: number;
  edited: number;
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

        const response = await fetch(`/api/conversations?userId=${user.id}`);

        const result = await response.json();

        console.log("CONVERSATIONS:", result);

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
    Current user বাদ দিয়ে অপর পাশের user বের করছি।

    যদি:
    senderId = current user
    তাহলে developer = receiver

    আর যদি:
    receiverId = current user
    তাহলে developer = sender
  */

  const getDeveloperInfo = (conversation: Conversation) => {
    const currentUserId = String(user?.id);

    if (String(conversation.senderId) === currentUserId) {
      return {
        id: conversation.receiverId,
        name: conversation.receiverName,
        developerPhoto: conversation.developerPhoto,
      };
    }

    return {
      id: conversation.senderId,
      name: conversation.senderName,
      developerPhoto: conversation.developerPhoto,
    };
  };
  const handleDeveloperClick = (conversation: Conversation) => {
    const developer = getDeveloperInfo(conversation);

    router.push(`/pages/recruiter/MessagePage?developerId=${developer.id}`);
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-(--text-muted)">
        Loading conversations...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-(--text-muted)">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="w-full">
      {conversations.map((conversation) => {
        const developer = getDeveloperInfo(conversation);

        return (
          <button
            key={conversation.conversationId}
            type="button"
            onClick={() => handleDeveloperClick(conversation)}
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
            {/* Developer Image */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--primary) text-sm font-semibold text-white">
              <div className="flex h-full w-full items-center justify-center">
                {developer.developerPhoto ? (
                  <Image
                    src={developer.developerPhoto}
                    alt={developer.name || "Developer"}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {developer.name
                      ?.trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word.charAt(0).toUpperCase())
                      .join("")}
                  </span>
                )}
              </div>
            </div>

            {/* Developer Name */}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-(--text)">
                {developer.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                {conversation.message}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
