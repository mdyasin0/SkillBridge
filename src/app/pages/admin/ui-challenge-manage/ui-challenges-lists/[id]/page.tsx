
"use client";

import LoadingUI from "@/components/Loadinui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Challenge = {
  id: number;
  title: string;
  description: string;
  technology: string;
  difficulty: string;
  category: string;
  timeLimit: number;
  maxAttempts: number;
};

export default function ChallengeDetails() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchChallenge = async () => {
      try {
        const response = await fetch(
          `/api/ui_challenge_manage/uichallengedata/${id}`
        );

        const result = await response.json();

        console.log("API response:", result);

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch challenge"
          );
        }

        const data = result.data ?? result;

        if (!data || !data.id) {
          throw new Error("Challenge data not found");
        }

        setChallenge(data);
      } catch (error) {
        console.error("Fetch challenge error:", error);
      }
    };

    fetchChallenge();
  }, [id]);

  if (!challenge) {
    return <LoadingUI />;
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
      <div
        className="w-full min-w-0 rounded-2xl border p-4 sm:p-6 md:p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1
          className="mb-6 break-words text-2xl font-bold sm:mb-8 sm:text-3xl"
          style={{
            color: "var(--text)",
          }}
        >
          {challenge.title}
        </h1>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:gap-6">
          <Info
            title="Description"
            value={challenge.description}
          />

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            <Info
              title="Technology"
              value={challenge.technology}
            />

            <Info
              title="Difficulty"
              value={challenge.difficulty}
            />

            <Info
              title="Category"
              value={challenge.category}
            />

            <Info
              title="Time Limit"
              value={`${challenge.timeLimit} Minutes`}
            />

            <Info
              title="Max Attempts"
              value={challenge.maxAttempts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      className="w-full min-w-0 rounded-xl border p-4 sm:p-5"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <h3
        className="mb-2 text-sm font-medium sm:text-base"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {title}
      </h3>

      <p
        className="break-words text-base font-semibold sm:text-lg"
        style={{
          color: "var(--text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
