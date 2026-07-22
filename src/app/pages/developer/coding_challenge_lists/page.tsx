"use client";

import { useAuth } from "@/context/AuthContext";
import { Filter, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { LuClock3, LuShieldAlert, LuTimerReset } from "react-icons/lu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  category: string;
}

export default function ChallengesPage() {
  const [tableData, setTableData] = useState<Challenge[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    available: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);
  const MySwal = withReactContent(Swal);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"available" | "completed">(
  "available"
);
  const [apiData, setApiData] = useState({
    available: [],
    completed: [],
  });
  const categories = [
    "All",
    ...new Set(tableData.map((item) => item.category)),
  ];
  const filteredData = tableData.filter((item) => {
    const difficultyMatch =
      difficultyFilter === "All" || item.difficulty === difficultyFilter;

    const categoryMatch =
      categoryFilter === "All" || item.category === categoryFilter;

    return difficultyMatch && categoryMatch;
  });
  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/coding_challenge-manage/all_coding_challenge?userId=${user.id}`)
      .then((res) => res.json())
      .then((res) => {
        setApiData(res.data);

        setTableData(res.data.available);
        setCounts(res.counts);
        setLoading(false);
      });
  }, [user]);
  const router = useRouter();

  const handleStartChallenge = async (id: number) => {
    const result = await MySwal.fire({
      title: "Start Coding Challenge",

      html: (
        <div className="mt-3 text-left">
          {/* Hero */}
          <div className="mb-5 flex items-center gap-4 rounded-2xl border border-(--border) bg-(--surface-hover) p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary) text-white shadow-lg">
              <LuClock3 size={30} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-(--text)">
                Your timer starts instantly
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                Once you begin, the countdown cannot be paused or restarted.
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="rounded-2xl border border-(--border) bg-(--surface-hover) p-5">
            <h4 className="mb-4 text-base font-semibold text-(--text)">
              Before you continue
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600">
                  <IoCheckmarkDone size={18} />
                </div>

                <p className="text-sm text-(--text-muted)">
                  The challenge timer starts immediately after clicking{" "}
                  <span className="font-semibold text-(--text)">
                    Start Challenge
                  </span>
                  .
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600">
                  <IoCheckmarkDone size={18} />
                </div>

                <p className="text-sm text-(--text-muted)">
                  Submit your solution before the allocated time expires.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-100 p-1 text-amber-600">
                  <LuTimerReset size={18} />
                </div>

                <p className="text-sm text-(--text-muted)">
                  The timer{" "}
                  <strong>cannot be paused, restarted, or reset.</strong>
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="mt-0.5 rounded-full bg-red-100 p-1 text-red-600">
                  <LuShieldAlert size={18} />
                </div>

                <p className="text-sm font-medium text-red-700">
                  If the time limit expires, your solution will be submitted
                  automatically. If no valid solution is submitted, you will
                  receive <strong>0 score</strong>.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-sm font-medium text-(--primary)">
            Make sure you are ready before starting.
          </p>
        </div>
      ),

      icon: undefined,

      width: 720,
      background: "var(--surface)",

      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,

      confirmButtonText: "Start Challenge",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#5B6CFF",
      cancelButtonColor: "#CBD5E1",

      customClass: {
        popup: "rounded-3xl shadow-2xl",
        title: "pt-4 text-3xl font-bold text-[var(--text)]",
        confirmButton:
          "rounded-xl px-7 py-3 font-semibold text-white flex items-center gap-2",
        cancelButton: "rounded-xl px-7 py-3 font-semibold text-slate-700",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/solution_submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // তোমার login user id
          challengeId: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        MySwal.fire({
          icon: "error",
          title: "Unable to Start",
          text: data.message,
        });

        return;
      }

      router.push(`/pages/developer/code_editor/${id}?userId=${user.id}`);
    } catch (error) {
      console.error(error);

      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6  items-center justify-between">
        <h1 className="text-3xl font-bold">Coding Challenge Lists</h1>
        <p className="mt-2 text-sm text-gray-500">
  {activeTab === "available"
    ? "Explore all available coding challenges and complete the ones that match your skills and interests."
    : "Review your completed coding challenges and resubmit them if you still have attempts remaining."}
</p>
<div className="flex mt-5 gap-5 ">
  <button
  className={`px-4 py-2 rounded-lg ${
    activeTab === "available"
      ? "bg-blue-600 text-white"
      : "border"
  }`}
  onClick={() => {
    setActiveTab("available");
    setTableData(apiData.available);
  }}
>
  All ({counts.available})
</button>

    
{counts.completed > 0 && (
  <button
    className={`px-4 py-2 rounded-lg ${
      activeTab === "completed"
        ? "bg-blue-600 text-white"
        : "border"
    }`}
    onClick={() => {
      setActiveTab("completed");
      setTableData(apiData.completed);
    }}
  >
    Completed ({counts.completed})
  </button>
)}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>

</div>
     
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
                 <button
  onClick={() => handleStartChallenge(item.id)}
  className="px-4 py-2 rounded-lg text-white"
  style={{ background: "var(--primary)" }}
>
  {activeTab === "available"
    ? "Complete Challenge"
    : "View Submission"}
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
