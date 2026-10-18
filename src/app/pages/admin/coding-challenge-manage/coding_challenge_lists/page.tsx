"use client";

import LoadingUI from "@/components/Loadinui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  category: string;
}

export default function ChallengesPage() {
  const [data, setData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/coding_challenge-manage/all_coding_challenge")
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
        `/api/coding_challenge-manage/codingchallengedelete/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message || "Failed to delete challenge");
        return;
      }

      setData((prev) => prev.filter((item) => item.id !== id));

      toast.success(result.message);
    } catch (error) {
      console.error("Delete request failed:", error);
      toast.error("Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingUI />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <h1
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 break-words"
        style={{ color: "var(--text)" }}
      >
        Coding-Challenge-lists
      </h1>

      <div
        className="w-full overflow-hidden rounded-xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse">
            <thead
              style={{
                background: "var(--surface-hover)",
                color: "var(--text)",
              }}
            >
              <tr>
                <th className="text-left p-3 sm:p-4">Title</th>
                <th className="text-left p-3 sm:p-4">Difficulty</th>
                <th className="text-left p-3 sm:p-4">Category</th>
                <th className="text-center p-3 sm:p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => (
                <tr
                  key={item.id}
                  className="border-t transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <td className="p-3 sm:p-4 break-words">
                    {item.title}
                  </td>

                  <td className="p-3 sm:p-4 break-words">
                    {item.difficulty}
                  </td>

                  <td className="p-3 sm:p-4 break-words">
                    {item.category}
                  </td>

                  <td className="p-3 sm:p-4">
                    <div className="flex flex-wrap items-center justify-center gap-2 min-w-[260px]">
                      <Link
                        href={`/pages/admin/coding-challenge-manage/coding_challenge_lists/${item.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          background: "var(--primary)",
                          color: "#FFFFFF",
                        }}
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center justify-center px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--surface-hover)",
                          color: "var(--text)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {deletingId === item.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                      <Link
                        href={`/pages/admin/coding-challenge-manage/updatecodingchallenge/${item.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          background: "var(--primary-hover)",
                          color: "#FFFFFF",
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