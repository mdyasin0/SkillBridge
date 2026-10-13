
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
      <div className="max-w-5xl mx-auto p-8">
        <p className="text-red-500">
          {error || "Challenge not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div
        className="rounded-xl p-8 border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <h1 className="text-3xl font-bold mb-6">
          {challenge.title}
        </h1>

        <div className="space-y-4">
          <p>
            <b>Description:</b>
            <br />
            {challenge.description}
          </p>

          <p>
            <b>Difficulty:</b> {challenge.difficulty}
          </p>

          <p>
            <b>Category:</b> {challenge.category}
          </p>

          <p>
            <b>Time Limit:</b> {challenge.timeLimit} sec
          </p>

          <p>
            <b>Max Attempt:</b> {challenge.maxAttempt}
          </p>

          <p>
            <b>Hint:</b> {challenge.hint || "No hint available"}
          </p>

          <div>
            <h2 className="font-bold text-xl mb-3">
              Starter Code
            </h2>

            <pre
              className="p-4 rounded-lg overflow-auto whitespace-pre-wrap"
              style={{
                background: "var(--bg)",
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
