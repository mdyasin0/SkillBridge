"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChallengeDetails() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<any>();

  useEffect(() => {
    fetch(`/api/all_challenge/${id}`)
      .then((res) => res.json())
      .then((data) => setChallenge(data));
  }, [id]);

  if (!challenge)
    return (
      <div className="p-10">
        Loading...
      </div>
    );

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
            <b>Languages:</b>{" "}
            {challenge.allowedLanguages.join(", ")}
          </p>

          <p>
            <b>Hint:</b> {challenge.hint}
          </p>

          <p>
            <b>Reward Badge:</b>{" "}
            {challenge.rewardBadge}
          </p>

          <div>

            <h2 className="font-bold text-xl mb-3">
              Starter Code
            </h2>

            <pre
              className="p-4 rounded-lg overflow-auto"
              style={{
                background: "var(--bg)",
              }}
            >
              {challenge.starterCode}
            </pre>

          </div>

          <div>

            <h2 className="font-bold text-xl mb-3">
              Test Cases
            </h2>

            {challenge.testCases.map(
              (test: any, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 mb-4"
                  style={{
                    borderColor: "var(--border)",
                  }}
                >
                  <p>
                    <b>Input:</b> {test.input}
                  </p>

                  <p>
                    <b>Output:</b> {test.output}
                  </p>
                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}