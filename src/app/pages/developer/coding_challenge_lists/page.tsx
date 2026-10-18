
"use client";

import LoadingUI from "@/components/Loadinui";
import { useAuth } from "@/context/AuthContext";

import { Filter, X } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { LuClock3, LuShieldAlert, LuTimerReset } from "react-icons/lu";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  submit_attempts: number;
  maxAttempt: number;
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
    "available",
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

    const getChallenges = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/developer_coding-challenge/all-coding-challenge?userId=${user.id}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch challenges",
          );
        }

        setApiData({
          available: Array.isArray(result.data?.available)
            ? result.data.available
            : [],
          completed: Array.isArray(result.data?.completed)
            ? result.data.completed
            : [],
        });

        setTableData(
          Array.isArray(result.data?.available)
            ? result.data.available
            : [],
        );

        setCounts(result.counts);
      } catch (error) {
        console.error("Challenge fetch error:", error);
        toast.error("Failed to load coding challenges.");

        setApiData({
          available: [],
          completed: [],
        });
        setTableData([]);
        setCounts({
          all: 0,
          available: 0,
          completed: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    getChallenges();
  }, [user?.id]);

  const router = useRouter();

  const handleStartChallenge = async (id: number) => {
    const result = await MySwal.fire({
      title: "Start Coding Challenge",

      html: (
        <div className="mt-3 w-full min-w-0 text-left">
          {/* Hero */}
          <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-(--border) bg-(--surface-hover) p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--primary) text-white shadow-lg sm:h-14 sm:w-14">
              <LuClock3 size={30} />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-(--text) sm:text-lg">
                Your timer starts instantly
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                Once you begin, the countdown cannot be paused or restarted.
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="rounded-2xl border border-(--border) bg-(--surface-hover) p-4 sm:p-5">
            <h4 className="mb-4 text-base font-semibold text-(--text)">
              Before you continue
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-full bg-(--surface) p-1 text-(--primary)">
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
                <div className="mt-0.5 shrink-0 rounded-full bg-(--surface) p-1 text-(--primary)">
                  <IoCheckmarkDone size={18} />
                </div>

                <p className="text-sm text-(--text-muted)">
                  Submit your solution before the allocated time expires.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-full bg-(--surface) p-1 text-(--text-muted)">
                  <LuTimerReset size={18} />
                </div>

                <p className="text-sm text-(--text-muted)">
                  The timer{" "}
                  <strong className="text-(--text)">
                    cannot be paused, restarted, or reset.
                  </strong>
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-(--border) bg-(--surface) p-3 sm:p-4">
                <div className="mt-0.5 shrink-0 rounded-full bg-(--surface-hover) p-1 text-(--primary)">
                  <LuShieldAlert size={18} />
                </div>

                <p className="text-sm font-medium text-(--text)">
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

      width: "min(720px, calc(100vw - 2rem))",
      background: "var(--surface)",
      color: "var(--text)",

      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,

      confirmButtonText: "Start Challenge",
      cancelButtonText: "Cancel",

      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--surface-hover)",

      customClass: {
        popup: "rounded-2xl shadow-2xl sm:rounded-3xl",
        title: "px-3 pt-4 text-xl font-bold text-[var(--text)] sm:text-3xl",
        htmlContainer: "px-3 sm:px-5",
        actions: "flex w-full flex-wrap justify-center gap-2 px-3 sm:px-5",
        confirmButton:
          "rounded-xl px-4 py-3 font-semibold text-white sm:px-7",
        cancelButton:
          "rounded-xl px-4 py-3 font-semibold text-[var(--text)] sm:px-7",
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
          userId: user.id, // login user id
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
      toast.error(String(error));

      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleResubmitChallenge = async (
    id: number,
    submit_attempts: number,
    maxAttempt: number,
  ) => {
    const result = await MySwal.fire({
      title: "Start Challenge Resubmission",

      html: (
        <div className="mt-3 w-full min-w-0 text-left">
          {/* Hero */}
          <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-(--border) bg-(--surface-hover) p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--primary) text-white shadow-lg sm:h-14 sm:w-14">
              <LuClock3 size={30} />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-(--text) sm:text-lg">
                Your resubmission timer starts immediately
              </h3>

              <p className="mt-1 text-sm text-(--text-muted)">
                Once you begin, the countdown cannot be paused or restarted.
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="rounded-2xl border border-(--border) bg-(--surface-hover) p-4 sm:p-5">
            <h4 className="mb-4 text-base font-semibold text-(--text)">
              Before you continue
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-full bg-(--surface) p-1 text-(--primary)">
                  <IoCheckmarkDone size={18} />
                </div>

                <p className="text-sm text-(--text-muted)">
                  The timer starts immediately after you click{" "}
                  <span className="font-semibold text-(--text)">
                    Start Resubmission
                  </span>
                  .
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-full bg-(--surface) p-1 text-(--text-muted)">
                  <LuTimerReset size={18} />
                </div>

                <p className="text-sm text-(--text-muted)">
                  The timer{" "}
                  <strong className="text-(--text)">
                    cannot be paused, restarted, or reset.
                  </strong>
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-(--border) bg-(--surface) p-3 sm:p-4">
                <div className="mt-0.5 shrink-0 rounded-full bg-(--surface-hover) p-1 text-(--primary)">
                  <LuShieldAlert size={18} />
                </div>

                <p className="text-sm font-medium text-(--text)">
                  Starting a resubmission will use{" "}
                  <strong>1 additional attempt</strong>. You have used{" "}
                  <strong>{submit_attempts}</strong> of{" "}
                  <strong>{maxAttempt}</strong> attempts. After confirming, your
                  remaining attempts will decrease by 1.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-sm font-medium text-(--primary)">
            Make sure you are ready before starting your resubmission.
          </p>
        </div>
      ),

      icon: undefined,

      width: "min(720px, calc(100vw - 2rem))",
      background: "var(--surface)",
      color: "var(--text)",

      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,

      confirmButtonText: "Start Resubmission",
      cancelButtonText: "Cancel",

      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--surface-hover)",

      customClass: {
        popup: "rounded-2xl shadow-2xl sm:rounded-3xl",
        title: "px-3 pt-4 text-xl font-bold text-[var(--text)] sm:text-3xl",
        htmlContainer: "px-3 sm:px-5",
        actions: "flex w-full flex-wrap justify-center gap-2 px-3 sm:px-5",
        confirmButton:
          "rounded-xl px-4 py-3 font-semibold text-white sm:px-7",
        cancelButton:
          "rounded-xl px-4 py-3 font-semibold text-[var(--text)] sm:px-7",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/solution_resubmit-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // login user id
          challengeId: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "MAX_ATTEMPTS_REACHED") {
          await MySwal.fire({
            icon: "warning",
            title: "Maximum Attempts Reached",
            text: data.message,
          });

          return;
        }

        await MySwal.fire({
          icon: "error",
          title: "Unable to Start",
          text: data.message,
        });

        return;
      }

      router.push(`/pages/developer/recode_editor/${id}?userId=${user.id}`);
    } catch (error) {
      toast.error(String(error));

      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  if (loading) return <LoadingUI />;

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 p-3 sm:p-5 md:p-6 lg:p-8">
      <div className="mb-6 min-w-0">
        <h1 className="text-2xl font-bold text-(--text) sm:text-3xl">
          Coding Challenge Lists
        </h1>

        <p className="mt-2 text-sm leading-6 text-(--text-muted)">
          {activeTab === "available"
            ? "Explore all available coding challenges and complete the ones that match your skills and interests."
            : "Review your completed coding challenges and resubmit them if you still have attempts remaining."}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition sm:px-4 ${
              activeTab === "available"
                ? "border-(--primary) bg-(--primary) text-white"
                : "border-(--border) bg-(--surface) text-(--text) hover:bg-(--surface-hover)"
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
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition sm:px-4 ${
                activeTab === "completed"
                  ? "border-(--primary) bg-(--primary) text-white"
                  : "border-(--border) bg-(--surface) text-(--text) hover:bg-(--surface-hover)"
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
            className="flex items-center justify-center gap-2 rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm font-medium text-(--text) transition hover:bg-(--surface-hover) sm:px-4"
          >
            <Filter className="h-5 w-5 shrink-0" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="mb-6 min-w-0 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-sm sm:p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-(--border) pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <Filter className="h-5 w-5 shrink-0 text-(--primary)" />
              <h2 className="text-base font-semibold text-(--text) sm:text-lg">
                Filter Challenges
              </h2>
            </div>

            <button
              onClick={() => setShowFilter(false)}
              aria-label="Close filters"
              className="shrink-0 rounded-lg p-2 text-(--text-muted) transition hover:bg-(--surface-hover) hover:text-(--text)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
            {/* Difficulty */}
            <div className="min-w-0">
              <label className="mb-3 block text-sm font-medium text-(--text)">
                Difficulty
              </label>

              <div className="flex flex-wrap gap-2">
                {["All", "Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficultyFilter(level)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition sm:px-4 ${
                      difficultyFilter === level
                        ? "border-(--primary) bg-(--primary) text-white"
                        : "border-(--border) bg-(--surface) text-(--text) hover:border-(--primary) hover:bg-(--surface-hover)"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="min-w-0">
              <label className="mb-3 block text-sm font-medium text-(--text)">
                Technology
              </label>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-(--border) bg-(--surface) px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col gap-4 border-t border-(--border) pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-(--text-muted)">
              Filters are applied instantly.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setDifficultyFilter("All");
                  setCategoryFilter("All");
                }}
                className="rounded-lg border border-(--border) bg-(--surface) px-5 py-2 text-sm font-medium text-(--text) transition hover:bg-(--surface-hover)"
              >
                Reset
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="rounded-lg bg-(--primary) px-5 py-2 text-sm font-medium text-white transition hover:bg-(--primary-hover)"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-full min-w-0 overflow-hidden rounded-xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm sm:text-base">
            <thead
              style={{
                background: "var(--surface-hover)",
                color: "var(--text)",
              }}
            >
              <tr>
                <th className="p-3 text-left font-semibold sm:p-4">
                  Title
                </th>
                <th className="p-3 text-left font-semibold sm:p-4">
                  Difficulty
                </th>
                <th className="p-3 text-left font-semibold sm:p-4">
                  Category
                </th>
                <th className="p-3 text-center font-semibold sm:p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-t transition hover:bg-(--surface-hover)"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <td className="break-words p-3 sm:p-4">
                    {item.title}
                  </td>

                  <td className="p-3 sm:p-4">
                    {item.difficulty}
                  </td>

                  <td className="break-words p-3 sm:p-4">
                    {item.category}
                  </td>

                  <td className="p-3 text-center sm:p-4">
                    {activeTab === "available" ? (
                      <button
                        onClick={() => handleStartChallenge(item.id)}
                        className="inline-flex max-w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:px-4"
                        style={{ background: "var(--primary)" }}
                      >
                        Complete Challenge
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {item.submit_attempts >= item.maxAttempt ? (
                          <button
                            disabled
                            className="max-w-full cursor-not-allowed rounded-lg border border-(--border) bg-(--surface-hover) px-3 py-2 text-sm font-medium text-(--text-muted) opacity-80 sm:px-4"
                          >
                            Maximum Attempts Reached {item.submit_attempts} /{" "}
                            {item.maxAttempt}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleResubmitChallenge(
                                item.id,
                                item.submit_attempts,
                                item.maxAttempt,
                              )
                            }
                            className="inline-flex max-w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:px-4"
                            style={{ background: "var(--primary)" }}
                          >
                            Resubmit Challenge {item.submit_attempts} /{" "}
                            {item.maxAttempt}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-(--text-muted) sm:p-10"
                  >
                    No challenges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
