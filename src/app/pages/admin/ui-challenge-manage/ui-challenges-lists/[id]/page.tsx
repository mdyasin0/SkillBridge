"use client";
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
  rewardBadge: string;
};



export default  function ChallengeDetails() {
  const { id } = useParams();

 const [challenge, setChallenge] = useState<Challenge | null>(null);
  useEffect(() => {
    fetch(`/api/ui_challenge_manage/uichallengedata/${id}`)
      .then((res) => res.json())
      .then((res) => setChallenge(res.data));
  }, [id]);

  if (!challenge) {
    return <div className="p-10">Loading...</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div
        className="rounded-2xl border p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1 className="text-3xl font-bold mb-8">
          {challenge.title}
        </h1>

        <div className="space-y-6">
          <Info
            title="Description"
            value={challenge.description}
          />

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

          <Info
            title="Reward Badge"
            value={challenge.rewardBadge || "No Badge"}
          />
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
      className="border rounded-xl p-5"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <h3
        className="text-sm mb-2"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {title}
      </h3>

      <p className="text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}