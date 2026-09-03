"use client";
import { useAuth } from "@/context/AuthContext";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

export type Submission = {
  user_id: number;
  name: string;
  email: string;

  challenge_id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  allowedLanguages: string;
  timeLimit: number;
  maxAttempt: number;
  hint: string;
  rewardBadge: string;

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
    const res = await fetch("/api/pro_sol_review_submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionId: selected?.submission_id, // <-- এটা ঠিক করো
        feedback: review.feedback,
        score: Number(review.score),
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      alert(json.message || "Something went wrong.");
      return;
    }

    alert(json.message);

    setShowReviewForm(false);
    setSelected(null);

    setReview({
      feedback: "",
      score: "",
    });

    await getData();
  } catch (error) {
    console.error(error);
    alert("Network error. Please try again.");
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
      <div>
        <h1 className="text-2xl font-bold text-(--text)">
          Problem solving Submissions
        </h1>

        <p className="mt-3 text-sm text-(--text-muted)">
          View and manage candidate problem solution .
        </p>
      </div>

      {/* search box */}

      <div className="relative mt-10 w-full lg:w-80">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
        />

        <input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
    h-11
    w-full
    rounded-xl
    border
    border-(--border)
    bg-(--bg)
    pl-11
    pr-4
    outline-none
    transition
    focus:border-(--primary)
    focus:ring-4
    focus:ring-blue-100
    "
        />
      </div>

      {/* filter button  */}

      <div className="flex mt-5 gap-3">
        <button
          onClick={() => setStatus("pending")}
          className={`px-5 py-2 rounded-xl font-medium transition

${status === "pending" ? "bg-(--primary) text-white" : "bg-(--surface) border"}

`}
        >
          Pending ({counts.pending})
        </button>

        <button
          onClick={() => setStatus("approved")}
          className={`px-5 py-2 rounded-xl font-medium transition

${status === "approved" ? "bg-(--primary) text-white" : "bg-(--surface) border"}

`}
        >
          Approved ({counts.approved})
        </button>
      </div>

      {/* table  */}
      <div className="overflow-hidden mt-5 rounded-2xl border border-(--border) bg-(--surface) shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-(--surface-hover)">
              <tr className="border-b border-(--border)">
                <th className="w-16 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  #
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  Candidate
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  Email Address
                </th>

                <th className="w-52 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  Submission
                </th>
              </tr>
            </thead>

            <tbody>
              {searchedData?.map((item, index) => (
                <tr
                  key={item.submission_id}
                  className="border-b border-(--border) transition-colors hover:bg-(--surface-hover)"
                >
                  {/* Serial */}
                  <td className="px-6 py-4 text-center font-medium">
                    {index + 1}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary) text-sm font-semibold text-white">
                        {item.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-(--text)">
                          {item.name}
                        </p>

                        <p className="text-xs text-(--text-muted)">Candidate</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-(--text-muted)">
                      {item.email}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelected(item)}
                        className="inline-flex h-10 items-center rounded-lg bg-(--primary) px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-(--primary-hover) hover:shadow-md active:scale-95"
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
                    className="py-14 text-center text-sm text-(--text-muted)"
                  >
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="
        w-full
        max-w-3xl
        max-h-[90vh]
        overflow-y-auto
        rounded-2xl
        bg-(--surface)
        shadow-2xl
        border
        border-(--border)
      "
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-(--border) bg-(--surface) px-6 py-4">
              <h2 className="text-xl font-bold text-(--text)">
                Submission Details
              </h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className="rounded-lg bg-(--primary) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--primary-hover)"
                >
                  {showReviewForm ? "Cancel Review" : "Submit Review"}
                </button>

                <button
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-(--surface-hover)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Candidate Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-(--text-muted)">
                  Candidate Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Candidate Name
                    </p>
                    <p className="mt-1 font-semibold">{selected.name}</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Email Address</p>
                    <p className="mt-1 break-all font-semibold">
                      {selected.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Challenge */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-(--text-muted)">
                  Challenge Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Challenge Title
                    </p>
                    <p className="mt-1 font-semibold">{selected.title}</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Category</p>
                    <p className="mt-1 font-semibold">{selected.category}</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="text-xs text-(--text-muted)">Description</p>
                    <p className="mt-2 leading-7">{selected.description}</p>
                  </div>
                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Difficulty</p>
                    <p className="mt-1 font-semibold">{selected.difficulty}</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Category</p>
                    <p className="mt-1 font-semibold">{selected.category}</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Time Limit</p>
                    <p className="mt-1 font-semibold">
                      {selected.timeLimit} Minutes
                    </p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Max Attempts</p>
                    <p className="mt-1 font-semibold">{selected.maxAttempt}</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="text-xs text-(--text-muted)">
                      Allowed Languages
                    </p>
                    <p className="mt-1 font-semibold">
                      {JSON.parse(selected.allowedLanguages).join(", ")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="text-xs text-(--text-muted)">Hint</p>
                    <p className="mt-1">{selected.hint}</p>
                  </div>
                </div>
              </div>

              {/* Submission */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-(--text-muted)">
                  Submission Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Reviewe Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        selected.check_status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selected.check_status}
                    </span>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">submit Status</p>

                    <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {selected.status}
                    </span>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Started At</p>

                    <p className="mt-1 font-medium">
                      {new Date(selected.start_time).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Submitted At</p>

                    <p className="mt-1 font-medium">
                      {selected.submitted_at
                        ? new Date(selected.submitted_at).toLocaleString()
                        : "Not Submitted"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="mb-3 text-xs text-(--text-muted)">
                      Submitted Code
                    </p>

                    <pre className="overflow-x-auto rounded-lg bg-black p-4 text-sm text-green-400">
                      <code>{selected.submitCode}</code>
                    </pre>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="text-xs text-(--text-muted)">
                      Admin Feedback
                    </p>

                    <p className="mt-2">
                      {selected.feedback ?? "No feedback provided yet."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Score</p>
                    <p className="mt-1 font-semibold">{selected.score}</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Attempts</p>
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
      {showReviewForm && selected && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-xl rounded-2xl bg-(--surface) p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
  <div>
                <h3 className="text-xl font-bold">Submit Review</h3>
<h6 className="text-sm">There will be no penalty for the first attempt; based on the original score (100), 5% will be deducted from the score for each additional attempt after the first.
</h6>
  </div>
              <button
                onClick={() => setShowReviewForm(false)}
                className="rounded-lg p-2 hover:bg-(--surface-hover)"
              >
                ✕
              </button>
            </div>

            {/* Feedback */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">Feedback</label>

              <textarea
                rows={6}
                value={review.feedback}
                onChange={(e) =>
                  setReview({
                    ...review,
                    feedback: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-(--border) p-4"
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
                className="h-11 w-40 rounded-xl border border-(--border) px-4"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="rounded-xl border px-5 py-2"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                disabled={loading}
                className="rounded-xl bg-(--primary) px-6 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Problem_solving_works;
