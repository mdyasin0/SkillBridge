"use client";

import { Filter, X } from "lucide-react";
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
  const [showFilter, setShowFilter] = useState(false);

  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const [technologyFilter, setTechnologyFilter] = useState("All");
  const technologies = ["All", ...new Set(data.map((item) => item.technology))];
  const filteredData = data.filter((item) => {
    const difficultyMatch =
      difficultyFilter === "All" || item.difficulty === difficultyFilter;

    const technologyMatch =
      technologyFilter === "All" || item.technology === technologyFilter;

    return difficultyMatch && technologyMatch;
  });
  useEffect(() => {
    fetch("/api/ui_challenge_manage/uichallengedata")
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">UI Challenges</h1>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 rounded-lg border px-4 py-2"
        >
          <Filter size={18} />
          Filter
        </button>
      </div>
      {showFilter && (
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Filter Challenges</h2>
            </div>

            <button
              onClick={() => setShowFilter(false)}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Difficulty */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Difficulty
              </h3>

              <div className="flex flex-wrap gap-3">
                {["All", "Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      difficultyFilter === level
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Technology */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Technology
              </label>

              <select
                value={technologyFilter}
                onChange={(e) => setTechnologyFilter(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              >
                {technologies.map((tech) => (
                  <option key={tech}>{tech}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-between  border-t pt-4">
            <p className="text-sm text-gray-500">
              Filters are applied instantly.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDifficultyFilter("All");
                  setTechnologyFilter("All");
                }}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
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
            {filteredData.map((challenge) => (
              <tr
                key={challenge.id}
                className="border-t"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <td className="p-4">{challenge.title}</td>

                <td className="p-4">{challenge.technology}</td>

                <td className="p-4">{challenge.difficulty}</td>

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
