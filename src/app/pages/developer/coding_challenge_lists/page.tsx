"use client";

import { Filter, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  category: string;
}

export default function ChallengesPage() {
  const [data, setData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const categories = ["All", ...new Set(data.map((item) => item.category))];
  const filteredData = data.filter((item) => {
    const difficultyMatch =
      difficultyFilter === "All" || item.difficulty === difficultyFilter;

    const categoryMatch =
      categoryFilter === "All" || item.category === categoryFilter;

    return difficultyMatch && categoryMatch;
  });
  useEffect(() => {
    fetch("/api/coding_challenge-manage/all_coding_challenge")
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coding Challenge Lists</h1>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>
      {showFilter && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="flex gap-3 items-center">
              <Filter className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Filter Challenges
              </h2>
            </div>

            <button
              onClick={() => setShowFilter(false)}
              className="rounded-lg p-2 transition hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Difficulty */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Difficulty
              </label>

              <div className="flex flex-wrap gap-2">
                {["All", "Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficultyFilter(level)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition
              ${
                difficultyFilter === level
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
              }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Technology
              </label>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t pt-5">
            <p className="text-sm text-gray-500">
              Filters are applied instantly.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDifficultyFilter("All");
                  setCategoryFilter("All");
                }}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                Reset
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="overflow-hidden rounded-xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
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
              <th className="text-left p-4">Difficulty</th>
              <th className="text-left p-4">Category</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-t"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <td className="p-4">{item.title}</td>

                <td className="p-4">{item.difficulty}</td>

                <td className="p-4">{item.category}</td>

                <td className="p-4 text-center">
                  <Link
                    href={`/pages/developer/code_editor/${item.id}`}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{
                      background: "var(--primary)",
                    }}
                  >
                    Complete Challenge
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
