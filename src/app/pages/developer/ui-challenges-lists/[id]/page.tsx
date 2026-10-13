"use client";
import LoadingUI from "@/components/Loadinui";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { IoCheckmarkDone } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type Challenge = {
  id: number;
  title: string;
  description: string;
  technology: string;
  difficulty: string;
  category: string;
  timeLimit: number;
  start_time: string | null;
  maxAttempts: number;
  resubmit_started_at: string | null;
  resubmitStartedAtIsNull: boolean;
};

export default function ChallengeDetails() {
  const [timeLeft, setTimeLeft] = useState("");
  const MySwal = withReactContent(Swal);
  const { user } = useAuth();
  const { id } = useParams();
    const router = useRouter();
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [documentLink, setDocumentLink] = useState("");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  useEffect(() => {
    fetch(`/api/developer_uichallenge/uichallenge-data/${id}?userId=${user?.id}`)
      .then((res) => res.json())
      .then((res) => setChallenge(res.data));
  }, [id, user?.id]);

useEffect(() => {
  if (!challenge) return;

  const isResubmission =
    challenge.resubmitStartedAtIsNull === false &&
    challenge.resubmit_started_at !== null;

  if (isResubmission) {
    const startTime = new Date(
      challenge.resubmit_started_at!
    ).getTime();

    if (Number.isNaN(startTime)) {
      setTimeLeft("Invalid start time");
      return;
    }

    const updateTimer = () => {
      let totalSeconds = Math.max(
        0,
        Math.floor((Date.now() - startTime) / 1000)
      );

      const years = Math.floor(totalSeconds / 31536000);
      totalSeconds %= 31536000;

      const months = Math.floor(totalSeconds / 2592000);
      totalSeconds %= 2592000;

      const weeks = Math.floor(totalSeconds / 604800);
      totalSeconds %= 604800;

      const days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;

      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const parts: string[] = [];

      if (years) parts.push(`${years}y`);
      if (months) parts.push(`${months}mo`);
      if (weeks) parts.push(`${weeks}w`);
      if (days) parts.push(`${days}d`);
      if (hours) parts.push(`${hours}h`);
      if (minutes) parts.push(`${minutes}m`);

      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }

  if (!challenge.start_time) {
    setTimeLeft("");
    return;
  }

  const startTime = new Date(challenge.start_time).getTime();
  const endTime =
    startTime + Number(challenge.timeLimit) * 60 * 1000;

  const updateCountdown = () => {
    const remaining = endTime - Date.now();

    if (remaining <= 0) {
      setTimeLeft("Time Over");
      return;
    }

    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    setTimeLeft(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  };

  updateCountdown();

  const interval = setInterval(updateCountdown, 1000);

  return () => clearInterval(interval);
}, [challenge]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const result = await MySwal.fire({
    title: "Submit Project?",
    html: (
      <div className="text-left">
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-white">
            <CiWarning size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Final Submission Confirmation
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Please review your submission carefully before continuing.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <IoCheckmarkDone className="mt-1 text-green-600" />

              <span>
                Make sure your project completes{" "}
                <strong>all challenge requirements.</strong>
              </span>
            </li>

            <li className="flex items-start gap-3">
              <IoCheckmarkDone className="mt-1 text-green-600" />

              <span>
                Verify your <strong>Live URL</strong>,{" "}
                <strong>GitHub Repository</strong> and{" "}
                <strong>Document Link</strong>.
              </span>
            </li>

            <li className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <RxCross2 className="mt-1 text-red-600" />

              <span className="font-medium text-red-700">
                After submission you <strong>cannot edit or update</strong>{" "}
                your project information.
              </span>
            </li>
          </ul>
        </div>
      </div>
    ),

    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: "Submit Project",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563EB",
    cancelButtonColor: "#CBD5E1",

    width: 650,

    customClass: {
      popup: "rounded-3xl shadow-2xl",
      title: "text-2xl font-bold",
      confirmButton: "rounded-xl px-6 py-3 font-semibold",
      cancelButton: "rounded-xl px-6 py-3 font-semibold text-slate-700",
    },
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch("/api/submission/submit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        challengeId: challenge?.id,
        liveLink,
        githubLink,
        documentLink,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      await MySwal.fire({
        icon: "error",
        title: "Submission Failed",
        text: data.message,
        confirmButtonColor: "#DC2626",
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
        },
      });

      return;
    }

    await MySwal.fire({
      icon: "success",
      title: "Project Submitted",
      text: data.message,
      confirmButtonColor: "#2563EB",
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl px-6 py-3 font-semibold",
      },
    });

    setLiveLink("");
    setGithubLink("");
    setDocumentLink("");

    router.push("/pages/developer/ui-challenges-lists");
  } catch (error) {
    toast.error(String(error));

    await MySwal.fire({
      icon: "error",
      title: "Server Error",
      text: "Something went wrong. Please try again.",
      confirmButtonColor: "#DC2626",
      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl px-6 py-3 font-semibold",
      },
    });
  }
};
  if (!challenge) {
    return <LoadingUI/>;
  }
  return (
    <>
      <div className="max-w-6xl mx-auto p-8">
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="mb-6 text-2xl font-bold">Requirement details</h2>
          
{(() => {
  const isResubmission =
    challenge.resubmitStartedAtIsNull === false &&
    challenge.resubmit_started_at !== null;

  const isTimeOver = timeLeft === "Time Over";

  return (
    <div
      className={`my-6 overflow-hidden rounded-2xl border ${
        isResubmission
          ? "border-blue-200 bg-blue-50"
          : isTimeOver
          ? "border-red-200 bg-red-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${
              isResubmission
                ? "bg-blue-100 text-blue-700"
                : isTimeOver
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isResubmission ? "↻" : "◷"}
          </div>

          <div>
            <p
              className={`text-sm font-medium ${
                isResubmission
                  ? "text-blue-700"
                  : isTimeOver
                  ? "text-red-700"
                  : "text-amber-700"
              }`}
            >
              {isResubmission
                ? "Resubmission Elapsed Time"
                : "Challenge Countdown"}
            </p>

            <h2
              className={`mt-1 wrap-break-word text-3xl font-bold tracking-tight sm:text-4xl ${
                isResubmission
                  ? "text-blue-800"
                  : isTimeOver
                  ? "text-red-700"
                  : "text-amber-800"
              }`}
            >
              {timeLeft || "--:--:--"}
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              {isResubmission
                ? "Time elapsed since resubmission started"
                : isTimeOver
                ? "The original challenge time has expired"
                : "Time remaining to complete the challenge"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-black/5 bg-white/70 px-5 py-3 sm:min-w-36 sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Time Limit
          </p>

          <p className="mt-1 text-xl font-bold text-gray-800">
            {challenge.timeLimit} Minutes
          </p>
        </div>
      </div>
    </div>
  );
})()}

          <h1 className="text-3xl font-bold mb-8">{challenge.title}</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Review the challenge requirements carefully before submitting your
            project.
          </p>
          <div className="space-y-6">
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Description</h2>

              <div
                className="rounded-xl border p-5 leading-7"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-secondary)",
                }}
              >
                {challenge.description}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <DetailItem title="Technology" value={challenge.technology} />

              <DetailItem title="Difficulty" value={challenge.difficulty} />

              <DetailItem title="Category" value={challenge.category} />

              <DetailItem
                title="Time Limit"
                value={`${challenge.timeLimit} Minutes`}
              />

              <DetailItem title="Max Attempts" value={challenge.maxAttempts} />

            
            </div>
          </div>
        </div>
        <div
          className="mt-10 rounded-2xl border p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="mb-6 text-2xl font-bold">Project Submission</h2>

          <form
            className="space-y-6"
            onSubmit={handleSubmit}

             
            
          >
            <div>
              <label className="mb-2 block font-medium">Live Project URL</label>

              <input
                type="url"
                required
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                placeholder="https://your-project.vercel.app"
                className="w-full rounded-lg border p-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                GitHub Repository URL
              </label>

              <input
                type="url"
                required
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full rounded-lg border p-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Work Explanation Document URL
              </label>

              <input
                type="url"
                required
                value={documentLink}
                onChange={(e) => setDocumentLink(e.target.value)}
                placeholder="https://docs.google.com/..."
                className="w-full rounded-lg border p-3 outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg w-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Submit Project
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function DetailItem({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      className="rounded-xl border px-5 py-4"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wide"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {title}
      </p>

      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
