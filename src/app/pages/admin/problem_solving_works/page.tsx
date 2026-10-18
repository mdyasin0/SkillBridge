"use client";

import { useAuth } from "@/context/AuthContext";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type Submission = {
  user_id: number;
  name: string;
  email: string;
  challenge_id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  maxAttempt: number;
  hint: string;
  submission_id: number;
  submitCode: string;
  score: string;
  feedback: string | null;
  status: string;
  check_status: "pending" | "approved";
  submit_attempts: number;
  start_time: string;
  submitted_at: string | null;
  submission_created_at: string;
  submission_updated_at: string;
};

const Problem_solving_works = () => {
  const [data, setData] = useState<Submission[]>([]);
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState({
    feedback: "",
    score: "",
  });
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
  });

  const [status, setStatus] = useState<"pending" | "approved">("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);

  const getData = async () => {
    const res = await fetch(`/api/problem_solving_works?status=${status}`);
    const json = await res.json();

    setData(json.data);
    setCounts(json.meta.counts);
  };

  useEffect(() => {
    if (user?.id) {
      getData();
    }
  }, [status, user?.id]);

  const submitReview = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/pro_sol_review_submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId: selected?.submission_id,
          feedback: review.feedback,
          score: Number(review.score),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.info(json.message || "Something went wrong.");
        return;
      }

      toast.info(json.message);

      setShowReviewForm(false);
      setSelected(null);

      setReview({
        feedback: "",
        score: "",
      });

      await getData();
    } catch (error) {
      toast.error(String(error));
      toast.warn("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchedData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword)
    );
  });

  return (
    <>
      <div className="w-full min-w-0">
        <h1
          className="text-2xl sm:text-3xl font-bold break-words"
          style={{ color: "var(--text)" }}
        >
          Problem solving Submissions
        </h1>

        <p
          className="mt-2 sm:mt-3 text-sm sm:text-base"
          style={{ color: "var(--text-muted)" }}
        >
          View and manage candidate problem solution .
        </p>
      </div>

      {/* Search box */}

      <div className="relative mt-6 sm:mt-8 w-full max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />

        <input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border pl-11 pr-4 outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
          style={{
            background: "var(--bg)",
            color: "var(--text)",
            borderColor: "var(--border)",
          }}
        />
      </div>

      {/* Filter buttons */}

      <div className="flex flex-wrap mt-5 gap-2 sm:gap-3">
        <button
          onClick={() => setStatus("pending")}
          className="px-4 sm:px-5 py-2 rounded-xl border font-medium text-sm sm:text-base transition-colors"
          style={{
            background:
              status === "pending" ? "var(--primary)" : "var(--surface)",
            color: status === "pending" ? "#FFFFFF" : "var(--text)",
            borderColor:
              status === "pending" ? "var(--primary)" : "var(--border)",
          }}
        >
          Pending ({counts.pending})
        </button>

        <button
          onClick={() => setStatus("approved")}
          className="px-4 sm:px-5 py-2 rounded-xl border font-medium text-sm sm:text-base transition-colors"
          style={{
            background:
              status === "approved" ? "var(--primary)" : "var(--surface)",
            color: status === "approved" ? "#FFFFFF" : "var(--text)",
            borderColor:
              status === "approved" ? "var(--primary)" : "var(--border)",
          }}
        >
          Approved ({counts.approved})
        </button>
      </div>

      {/* Submissions table */}

      <div
        className="w-full min-w-0 overflow-hidden mt-5 rounded-2xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead
              className="sticky top-0 z-10"
              style={{ background: "var(--surface-hover)" }}
            >
              <tr
                className="border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <th
                  className="w-16 px-4 sm:px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  #
                </th>

                <th
                  className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Candidate
                </th>

                <th
                  className="px-4 sm:px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Email Address
                </th>

                <th
                  className="w-52 px-4 sm:px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Submission
                </th>
              </tr>
            </thead>

            <tbody>
              {searchedData?.map((item, index) => (
                <tr
                  key={item.submission_id}
                  className="border-b transition-colors hover:bg-(--surface-hover)"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <td className="px-4 sm:px-6 py-4 text-center font-medium">
                    {index + 1}
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          background: "var(--primary)",
                          color: "#FFFFFF",
                        }}
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold break-words">
                          {item.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Candidate
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className="text-sm break-all"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.email}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelected(item)}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg px-4 sm:px-5 py-2 text-sm font-medium transition-colors hover:opacity-90 active:scale-[0.98]"
                        style={{
                          background: "var(--primary)",
                          color: "#FFFFFF",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {searchedData?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 sm:py-14 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission details modal */}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
          <div
            className="w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-2xl border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
              color: "var(--text)",
            }}
          >
            {/* Header */}

            <div
              className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b px-4 sm:px-6 py-4"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2 className="text-lg sm:text-xl font-bold">
                Submission Details
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    if (selected) {
                      setReview({
                        feedback: selected.feedback ?? "",
                        score: selected.score ? String(selected.score) : "",
                      });
                    }

                    setShowReviewForm((prev) => !prev);
                  }}
                  className="rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: "var(--primary)",
                    color: "#FFFFFF",
                  }}
                >
                  {showReviewForm
                    ? "Cancel Review"
                    : selected?.check_status === "approved"
                      ? "Update Review"
                      : "Submit Review"}
                </button>

                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close submission details"
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-(--surface-hover)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-6 p-4 sm:p-6">
              {/* Candidate Information */}

              <div>
                <h3
                  className="mb-4 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Candidate Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div
                    className="rounded-xl border p-4 min-w-0"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Candidate Name
                    </p>
                    <p className="mt-1 font-semibold break-words">
                      {selected.name}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4 min-w-0"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Email Address
                    </p>
                    <p className="mt-1 break-all font-semibold">
                      {selected.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Challenge */}

              <div>
                <h3
                  className="mb-4 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Challenge Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div
                    className="rounded-xl border p-4 min-w-0"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Challenge Title
                    </p>
                    <p className="mt-1 font-semibold break-words">
                      {selected.title}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Category
                    </p>
                    <p className="mt-1 font-semibold">{selected.category}</p>
                  </div>

                  <div
                    className="rounded-xl border p-4 md:col-span-2"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Description
                    </p>
                    <p className="mt-2 leading-7 whitespace-pre-wrap break-words">
                      {selected.description}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Difficulty
                    </p>
                    <p className="mt-1 font-semibold">{selected.difficulty}</p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Category
                    </p>
                    <p className="mt-1 font-semibold">{selected.category}</p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Time Limit
                    </p>
                    <p className="mt-1 font-semibold">
                      {selected.timeLimit} Minutes
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Max Attempts
                    </p>
                    <p className="mt-1 font-semibold">{selected.maxAttempt}</p>
                  </div>

                  <div
                    className="rounded-xl border p-4 md:col-span-2"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                   
                  </div>

                  <div
                    className="rounded-xl border p-4 md:col-span-2"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Hint
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words">
                      {selected.hint}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission Information */}

              <div>
                <h3
                  className="mb-4 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Submission Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Reviewe Status
                    </p>

                    <span
                      className="mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium"
                      style={{
                        background:
                          selected.check_status === "approved"
                            ? "var(--surface-hover)"
                            : "var(--bg-secondary)",
                        color: "var(--text)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {selected.check_status}
                    </span>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      submit Status
                    </p>

                    <span
                      className="mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium"
                      style={{
                        background: "var(--surface-hover)",
                        color: "var(--text)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {selected.status}
                    </span>
                  </div>

                  <div
                    className="rounded-xl border p-4 min-w-0"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Started At
                    </p>
                    <p className="mt-1 font-medium break-words">
                      {new Date(selected.start_time).toLocaleString()}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4 min-w-0"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Submitted At
                    </p>
                    <p className="mt-1 font-medium break-words">
                      {selected.submitted_at
                        ? new Date(selected.submitted_at).toLocaleString()
                        : "Not Submitted"}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4 md:col-span-2 min-w-0"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="mb-3 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Submitted Code
                    </p>

                    <pre
                      className="max-w-full overflow-x-auto rounded-lg border p-3 sm:p-4 text-sm whitespace-pre-wrap break-words"
                      style={{
                        background: "var(--bg-secondary)",
                        color: "var(--text)",
                        borderColor: "var(--border)",
                        overflowWrap: "anywhere",
                      }}
                    >
                      <code>{selected.submitCode}</code>
                    </pre>
                  </div>

                  <div
                    className="rounded-xl border p-4 md:col-span-2"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Admin Feedback
                    </p>

                    <p className="mt-2 whitespace-pre-wrap break-words">
                      {selected.feedback ?? "No feedback provided yet."}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Score
                    </p>
                    <p className="mt-1 font-semibold">{selected.score}</p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Attempts
                    </p>
                    <p className="mt-1 font-semibold">
                      {selected.submit_attempts}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}

      {showReviewForm && selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 sm:p-4">
          <div
            className="w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl border p-4 sm:p-6"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold">
                  {selected?.check_status === "approved"
                    ? "Update Review"
                    : "Submit Review"}
                </h3>

                <h6
                  className="mt-2 text-xs sm:text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  There will be no penalty for the first attempt; based on the
                  original score (100), 5% will be deducted from the score for
                  each additional attempt after the first.
                </h6>
              </div>

              <button
                onClick={() => setShowReviewForm(false)}
                aria-label="Close review form"
                className="shrink-0 rounded-lg p-2 transition-colors hover:bg-(--surface-hover)"
              >
                ✕
              </button>
            </div>

            {/* Feedback */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Feedback
              </label>

              <textarea
                rows={6}
                value={review.feedback}
                onChange={(e) =>
                  setReview({
                    ...review,
                    feedback: e.target.value,
                  })
                }
                className="w-full min-w-0 rounded-xl border p-3 sm:p-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 resize-y"
                style={{
                  background: "var(--bg)",
                  color: "var(--text)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Score */}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">Score</label>

              <input
                type="number"
                min={0}
                max={100}
                value={review.score}
                onChange={(e) =>
                  setReview({
                    ...review,
                    score: e.target.value,
                  })
                }
                className="h-11 w-full sm:w-40 rounded-xl border px-4 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
                style={{
                  background: "var(--bg)",
                  color: "var(--text)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="rounded-xl border px-5 py-2.5 transition-colors hover:bg-(--surface-hover)"
                style={{
                  color: "var(--text)",
                  borderColor: "var(--border)",
                }}
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                disabled={loading}
                className="rounded-xl px-6 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "var(--primary)",
                  color: "#FFFFFF",
                }}
              >
                {loading
                  ? "Saving..."
                  : selected?.check_status === "approved"
                    ? "Update Review"
                    : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Problem_solving_works;