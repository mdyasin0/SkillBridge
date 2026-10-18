
"use client";
import { useAuth } from "@/context/AuthContext";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type SubmitInfo = {
  githubLink: string;
  liveLink: string;
  documentLink: string;
} | null;

export type Submission = {
  // User
  user_id: number;
  name: string;
  email: string;

  // Challenge
  challenge_id: number;
  title: string;
  description: string;
  category: string;
  createdAt: string;

  // Submission
  submission_id: number;
  submit_info: SubmitInfo;
  maxAttempts: number;
  submit_attempts: number;
  feedback: string | null;
  score: number;
  status: "pending" | "submitted";
  check_status: "pending" | "approved";

  start_time: string;
  submitted_at: string | null;

  submission_created_at: string;
  submission_updated_at: string;
};

const Project_works = () => {
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
    const res = await fetch(`/api/project_works?status=${status}`);

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

      const res = await fetch("/api/project_review_submit", {
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

      if (json.success) {
        setShowReviewForm(false);
        setSelected(null);

        setReview({
          feedback: "",
          score: "",
        });

        await getData();
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error(String(error));
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
        <h1 className="text-xl font-bold text-(--text) sm:text-2xl">
          Project Submissions
        </h1>

        <p className="mt-3 text-sm text-(--text-muted)">
          View and manage candidate project submissions.
        </p>
      </div>

      {/* Search box */}

      <div className="relative mt-6 w-full sm:mt-8 lg:mt-10 lg:w-80">
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
            bg-(--surface)
            pl-11
            pr-4
            text-(--text)
            outline-none
            transition
            placeholder:text-(--text-muted)
            focus:border-(--primary)
            focus:ring-2
            focus:ring-(--primary)
          "
        />
      </div>

      {/* Filter buttons */}

      <div className="mt-5 flex w-full flex-wrap gap-3">
        <button
          onClick={() => setStatus("pending")}
          className={`min-h-10 rounded-xl border px-4 py-2 text-sm font-medium transition sm:px-5 sm:text-base ${
            status === "pending"
              ? "border-(--primary) bg-(--primary) text-white"
              : "border-(--border) bg-(--surface) text-(--text) hover:bg-(--surface-hover)"
          }`}
        >
          Pending ({counts.pending})
        </button>

        <button
          onClick={() => setStatus("approved")}
          className={`min-h-10 rounded-xl border px-4 py-2 text-sm font-medium transition sm:px-5 sm:text-base ${
            status === "approved"
              ? "border-(--primary) bg-(--primary) text-white"
              : "border-(--border) bg-(--surface) text-(--text) hover:bg-(--surface-hover)"
          }`}
        >
          Approved ({counts.approved})
        </button>
      </div>

      {/* Table */}

      <div className="mt-5 w-full min-w-0 overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-sm">
        <div className="w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[600px] border-collapse text-(--text)">
            <thead className="sticky top-0 z-10 bg-(--surface-hover)">
              <tr className="border-b border-(--border)">
                <th className="w-16 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-(--text-muted) sm:px-6">
                  #
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--text-muted) sm:px-6">
                  Candidate
                </th>

                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--text-muted) sm:px-6">
                  Email Address
                </th>

                <th className="w-52 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-(--text-muted) sm:px-6">
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

                  <td className="px-4 py-4 text-center font-medium sm:px-6">
                    {index + 1}
                  </td>

                  {/* Name */}

                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--primary) text-sm font-semibold text-white">
                        {item.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="break-words font-semibold text-(--text)">
                          {item.name}
                        </p>

                        <p className="text-xs text-(--text-muted)">
                          Candidate
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}

                  <td className="break-all px-4 py-4 sm:px-6">
                    <span className="text-sm text-(--text-muted)">
                      {item.email}
                    </span>
                  </td>

                  {/* Action */}

                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelected(item)}
                        className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-lg bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-(--primary-hover) hover:shadow-md active:scale-95 sm:px-5"
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
                    className="px-4 py-14 text-center text-sm text-(--text-muted)"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-(--text)/60 p-3 sm:p-5">
          <div
            className="
              my-auto
              flex
              max-h-[calc(100dvh-1.5rem)]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-(--border)
              bg-(--surface)
              shadow-2xl
              sm:max-h-[90dvh]
            "
          >
            {/* Header */}

            <div className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-(--border) bg-(--surface) px-4 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-(--text) sm:text-xl">
                Submission Details
              </h2>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                  className="min-h-9 rounded-lg bg-(--primary) px-3 py-2 text-xs font-medium text-white transition hover:bg-(--primary-hover) sm:px-4 sm:text-sm"
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
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--text) hover:bg-(--surface-hover)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
              {/* Candidate Information */}

              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-(--text-muted) sm:text-sm">
                  Candidate Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Candidate Name
                    </p>

                    <p className="mt-1 break-words font-semibold text-(--text)">
                      {selected.name}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Email Address
                    </p>

                    <p className="mt-1 break-all font-semibold text-(--text)">
                      {selected.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Challenge */}

              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-(--text-muted) sm:text-sm">
                  Challenge Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Challenge Title
                    </p>

                    <p className="mt-1 break-words font-semibold text-(--text)">
                      {selected.title}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Category</p>

                    <p className="mt-1 break-words font-semibold text-(--text)">
                      {selected.category}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="text-xs text-(--text-muted)">Description</p>

                    <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-(--text)">
                      {selected.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission */}

              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-(--text-muted) sm:text-sm">
                  Submission Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Reviewe Status
                    </p>

                    <span className="mt-2 inline-flex max-w-full break-words rounded-full bg-(--surface-hover) px-3 py-1 text-sm font-medium text-(--text)">
                      {selected.check_status}
                    </span>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      submit Status
                    </p>

                    <span className="mt-2 inline-flex max-w-full break-words rounded-full bg-(--surface-hover) px-3 py-1 text-sm font-medium text-(--text)">
                      {selected.status}
                    </span>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Started At</p>

                    <p className="mt-1 break-words font-medium text-(--text)">
                      {new Date(selected.start_time).toLocaleString()}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Submitted At</p>

                    <p className="mt-1 break-words font-medium text-(--text)">
                      {selected.submitted_at
                        ? new Date(selected.submitted_at).toLocaleString()
                        : "Not Submitted"}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">Max Attempts</p>

                    <p className="mt-1 font-semibold text-(--text)">
                      {selected.maxAttempts ?? 0}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4">
                    <p className="text-xs text-(--text-muted)">
                      Submit Attempts
                    </p>

                    <p className="mt-1 font-semibold text-(--text)">
                      {selected.submit_attempts ?? 0}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="mb-3 text-xs text-(--text-muted)">
                      Submission Links
                    </p>

                    <div className="space-y-3">
                      <a
                        href={selected.submit_info?.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-all rounded-lg border border-(--border) p-3 text-(--text) transition hover:bg-(--surface-hover)"
                      >
                        🔗 GitHub Repository
                      </a>

                      <a
                        href={selected.submit_info?.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-all rounded-lg border border-(--border) p-3 text-(--text) transition hover:bg-(--surface-hover)"
                      >
                        🌐 Live Project
                      </a>

                      <a
                        href={selected.submit_info?.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-all rounded-lg border border-(--border) p-3 text-(--text) transition hover:bg-(--surface-hover)"
                      >
                        📄 Documentation
                      </a>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="text-xs text-(--text-muted)">
                      Admin Feedback
                    </p>

                    <p className="mt-2 whitespace-pre-wrap break-words text-(--text)">
                      {selected.feedback ?? "No feedback provided yet."}
                    </p>

                  </div>
                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg) p-4 md:col-span-2">
                    <p className="text-xs text-(--text-muted)">
                    Score
                    </p>

                    <p className="mt-2 whitespace-pre-wrap break-words text-(--text)">
                      {selected. score ?? "No feedback provided yet."}
                    </p>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReviewForm && selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-(--text)/60 p-3 sm:p-5">
          <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-2xl sm:max-h-[90dvh] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-(--text) sm:text-xl">
                  {selected?.check_status === "approved"
                    ? "Update Review"
                    : "Submit Review"}
                </h3>

                <h6 className="mt-2 text-sm leading-6 text-(--text-muted)">
                  There will be no penalty for the first attempt; based on the
                  original score (100), 5% will be deducted from the score for
                  each additional attempt after the first.
                </h6>
              </div>

              <button
                onClick={() => setShowReviewForm(false)}
                aria-label="Close review form"
                className="shrink-0 rounded-lg p-2 text-(--text) hover:bg-(--surface-hover)"
              >
                ✕
              </button>
            </div>

            {/* Feedback */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-(--text)">
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
                className="w-full resize-y rounded-xl border border-(--border) bg-(--surface) p-4 text-(--text) outline-none transition placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
              />
            </div>

            {/* Score */}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-(--text)">
                Score
              </label>

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
                className="h-11 w-full rounded-xl border border-(--border) bg-(--surface) px-4 text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary) sm:w-40"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="min-h-10 rounded-xl border border-(--border) px-5 py-2 text-sm font-medium text-(--text) transition hover:bg-(--surface-hover)"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                disabled={loading}
                className="min-h-10 rounded-xl bg-(--primary) px-5 py-2 text-sm font-medium text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
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

export default Project_works;
