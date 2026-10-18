
"use client";

import LoadingUI from "@/components/Loadinui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
console.log(data);
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this challenge?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(
        `/api/ui_challenge_manage/uichallengedelete/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.info(result.message);
        return;
      }

      // Remove deleted item from UI
      setData((prev) => prev.filter((item) => item.id !== id));

      toast.info(result.message);
    } catch (error) {
      toast.error(String(error));
      toast.info("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingUI />;
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
      <h1
        className="mb-5 text-2xl font-bold sm:mb-8 sm:text-3xl"
        style={{
          color: "var(--text)",
        }}
      >
        UI Challenges
      </h1>

      <div
        className="w-full min-w-0 overflow-hidden rounded-xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead
              style={{
                background: "var(--surface-hover)",
                color: "var(--text)",
              }}
            >
              <tr>
                <th className="p-3 text-sm font-semibold sm:p-4 sm:text-base">
                  Title
                </th>
                <th className="p-3 text-sm font-semibold sm:p-4 sm:text-base">
                  Technology
                </th>
                <th className="p-3 text-sm font-semibold sm:p-4 sm:text-base">
                  Difficulty
                </th>
                <th className="p-3 text-center text-sm font-semibold sm:p-4 sm:text-base">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((challenge) => (
                <tr
                  key={challenge.id}
                  className="border-t transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <td className="max-w-xs break-words p-3 text-sm sm:p-4 sm:text-base">
                    {challenge.title}
                  </td>

                  <td className="p-3 text-sm sm:p-4 sm:text-base">
                    {challenge.technology}
                  </td>

                  <td className="p-3 text-sm sm:p-4 sm:text-base">
                    {challenge.difficulty}
                  </td>

                  <td className="p-3 sm:p-4">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                      <Link
                        href={`/pages/admin/ui-challenge-manage/ui-challenges-lists/${challenge.id}`}
                        className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:opacity-90 sm:px-4"
                        style={{
                          background: "var(--primary)",
                        }}
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => handleDelete(challenge.id)}
                        disabled={deletingId === challenge.id}
                        className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                        style={{
                          background: "var(--surface-hover)",
                          color: "var(--text)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {deletingId === challenge.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                      <Link
                        href={`/pages/admin/ui-challenge-manage/edituichallenge/${challenge.id}`}
                        className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:opacity-90 sm:px-4"
                        style={{
                          background: "var(--primary-hover)",
                        }}
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
    </div>
  );
}
