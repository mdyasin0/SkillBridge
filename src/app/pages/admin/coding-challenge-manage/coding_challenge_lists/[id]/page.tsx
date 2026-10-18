"use client";

import LoadingUI from "@/components/Loadinui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  timeLimit: number;
  maxAttempt: number;
  starterCode: string | null;
  hint: string | null;
}

export default function ChallengeDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const getChallenge = async () => {
      setLoading(true);
      setError("");
      setChallenge(null);

      try {
        const res = await fetch(
          `/api/coding_challenge-manage/all_coding_challenge/${id}`
        );

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load challenge details"
          );
        }

        setChallenge(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    getChallenge();
  }, [id]);

  if (loading) return <LoadingUI />;

  if (error || !challenge) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p
          className="break-words"
          style={{ color: "var(--text)" }}
        >
          {error || "Challenge not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div
        className="rounded-xl p-4 sm:p-6 lg:p-8 border shadow-sm"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1
          className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 break-words"
          style={{ color: "var(--text)" }}
        >
          {challenge.title}
        </h1>

        <div className="space-y-4 sm:space-y-5">
          <p className="break-words whitespace-pre-wrap leading-relaxed">
            <b>Description:</b>
            <br />
            {challenge.description}
          </p>

          <p className="break-words">
            <b>Difficulty:</b> {challenge.difficulty}
          </p>

          <p className="break-words">
            <b>Category:</b> {challenge.category}
          </p>

          <p className="break-words">
            <b>Time Limit:</b> {challenge.timeLimit} sec
          </p>

          <p className="break-words">
            <b>Max Attempt:</b> {challenge.maxAttempt}
          </p>

          <p className="break-words whitespace-pre-wrap leading-relaxed">
            <b>Hint:</b> {challenge.hint || "No hint available"}
          </p>

          <div className="min-w-0">
            <h2
              className="font-bold text-lg sm:text-xl mb-3"
              style={{ color: "var(--text)" }}
            >
              Starter Code
            </h2>

            <pre
              className="p-3 sm:p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words text-sm sm:text-base max-w-full"
              style={{
                background: "var(--bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                overflowWrap: "anywhere",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {challenge.starterCode || "No starter code available"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}