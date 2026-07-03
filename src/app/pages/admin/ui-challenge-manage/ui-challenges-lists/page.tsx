"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Challenge = {
  id: number;
  title: string;
  technology: string;
  difficulty: string;
};

export default function UIChallengesPage() {
  const [data, setData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/ui_challenge_manage/uichallengedata")
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this challenge?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/uichallengedelete/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      // Remove deleted item from UI
      setData((prev) => prev.filter((item) => item.id !== id));

      alert(result.message);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        UI Challenges
      </h1>

      <div
        className="rounded-xl overflow-hidden border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <table className="w-full">
          <thead
            style={{
              background: "var(--surface-hover)",
            }}
          >
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Technology</th>
              <th className="text-left p-4">Difficulty</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((challenge) => (
              <tr
                key={challenge.id}
                className="border-t"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <td className="p-4">{challenge.title}</td>

                <td className="p-4">
                  {challenge.technology}
                </td>

                <td className="p-4">
                  {challenge.difficulty}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/pages/admin/ui-challenge-manage/ui-challenges-lists/${challenge.id}`}
                      className="px-4 py-2 rounded-lg text-white"
                      style={{
                        background: "var(--primary)",
                      }}
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(challenge.id)
                      }
                      disabled={deletingId === challenge.id}
                      className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
                      style={{
                        background: "#EF4444",
                      }}
                    >
                      {deletingId === challenge.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                    <Link
  href={`/pages/admin/edituichallenge/${challenge.id}`}
  className="px-4 py-2 rounded-lg text-white bg-green-600"
>
  Update
</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}