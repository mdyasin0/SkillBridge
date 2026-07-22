"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import { Send, Clock, Maximize2, Minimize2 } from "lucide-react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  allowedLanguages: string[];
  timeLimit: number;
  maxAttempt: number;
  starterCode: string;
  hint: string;
  rewardBadge: string;

  solutionId: number | null;
  score: number | null;
  feedback: string | null;
  check_status: string | null;
  submit_attempts: number;
  start_time: string | null;
  submitted_at: string | null;
  resubmit_start_at: string | null;
  resubmit_submitted_at: string | null;

  testCases: {
    input: string;
    output: string;
  }[];
}

interface Props {
  challenge: Challenge;
}

export default function ChallengeWorkspace({ challenge }: Props) {
  const [code, setCode] = useState(challenge.starterCode);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const submittingRef = useRef(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit * 60);
  const MySwal = useMemo(() => withReactContent(Swal), []);
  const handleSubmit = async (isAutoSubmit = false) => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    if (!isAutoSubmit) {
      const result = await MySwal.fire({
        title: "Submit Solution?",
        html: `
      <div style="text-align:left">
        <p style="margin-bottom:12px;">
          You are about to submit your solution for review.
        </p>

        <ul style="padding-left:18px;line-height:1.8;">
          <li>Your current code will be saved.</li>
          <li>The submission time will be recorded.</li>
          <li>Your solution will be sent for manual review.</li>
          <li>If you still have attempts remaining, you may resubmit later.</li>
        </ul>

        <p style="margin-top:16px;font-weight:600;color:#dc2626;">
          Are you sure you want to continue?
        </p>
      </div>
    `,
        icon: "warning",
        width: 650,
        background: "var(--surface)",
        showCancelButton: true,
        reverseButtons: true,
        focusCancel: true,
        confirmButtonText: "Yes, Submit",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#6b7280",
        customClass: {
          popup: "rounded-3xl",
          title: "text-2xl font-bold text-[var(--text)]",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
          cancelButton: "rounded-xl px-6 py-3 font-semibold",
        },
      });
      if (!result.isConfirmed) return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/solution_code_submit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId: challenge.solutionId,
          submitCode: code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        MySwal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.message,
        });
        return;
      }
      setIsSubmitted(true);
      if (!isAutoSubmit) {
        await MySwal.fire({
          icon: "success",
          title: "Submitted Successfully",
          text: "Your solution has been submitted for review.",
          confirmButtonColor: "#16a34a",
        });
      }
      router.replace("/pages/developer/coding_challenge_lists");
      if (isAutoSubmit) {
        setIsSubmitted(true);
        router.replace("/pages/developer/coding_challenge_lists");
        return;
      }
    } catch (error) {
      console.error(error);

      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };
  useEffect(() => {
    const updateTimer = () => {
      if (!challenge.start_time) return;

      const startTime = new Date(challenge.start_time).getTime();

      const duration = challenge.timeLimit * 60 * 1000;
      const endTime = startTime + duration;

      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0 && !isSubmitted && !submitting) {
        handleSubmit(true);
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [challenge.start_time, challenge.timeLimit, isSubmitted, submitting]);
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmitted) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [isSubmitted]);
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      if (isSubmitted) return;

      const target = e.target as HTMLElement;

      const link = target.closest("a");

      if (!link) return;

      e.preventDefault();

      const result = await MySwal.fire({
        title: "Leave Challenge?",
        html: `
      <p>
      If you leave this page before submitting,
      your current solution will be submitted automatically.
      </p>

      <br/>

      <strong>
      Are you sure you want to leave?
      </strong>
      `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Leave",
        cancelButtonText: "Stay",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      await handleSubmit(true);

      window.location.href = link.getAttribute("href")!;
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [code, isSubmitted]);
  useEffect(() => {
    history.pushState(null, "", location.href);

    const handlePopState = async () => {
      if (isSubmitted) return;

      history.pushState(null, "", location.href);

      const result = await MySwal.fire({
        title: "Leave Challenge?",
        text: "Leaving this page will automatically submit your current solution.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Leave",
        cancelButtonText: "Stay",
      });

      if (result.isConfirmed) {
        await handleSubmit(true);

        history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isSubmitted]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      {/* Main Layout */}
      {isFullscreen ? (
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}

          <div className="border-b border-zinc-800 p-3 flex justify-between">
            <span>Fullscreen Mode</span>

            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-zinc-800 px-3 py-2 rounded-lg"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          <Editor
            height="100%"
            language={challenge.allowedLanguages[0].toLowerCase()}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
          />
        </div>
      ) : (
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Problem Panel */}
          <Panel defaultSize={35} minSize={25}>
            <div className="h-full border-r border-zinc-800 overflow-y-auto p-5">
              <h2 className="text-xl font-semibold mb-3">Problem Statement</h2>

              <p className="text-zinc-300 mb-5">{challenge.description}</p>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Hint</h3>

                <div className="bg-zinc-900 p-3 rounded-lg">
                  <p>{challenge.hint}</p>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-0.5 bg-zinc-800 hover:bg-zinc-600 transition-colors" />
          {/* Right Editor Section */}

          <Panel defaultSize={65}>
            <div className="h-full flex flex-col">
              <div className="border-b border-zinc-800 p-3 flex items-center justify-between">
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white">
                    {challenge.allowedLanguages.join(", ")}
                  </span>
                </div>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-zinc-800 px-3 py-2 rounded-lg"
                >
                  {isFullscreen ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
              </div>
              {/* Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={challenge.allowedLanguages[0].toLowerCase()}
                  value={code}
                  theme="vs-dark"
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>

              {/* Top Bar */}
              <div className="border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
                <div>
                  <h1 className="font-bold text-lg">{challenge.title}</h1>

                  <p className="text-sm text-zinc-400">
                    {challenge.difficulty}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Clock size={18} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-green-600 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-green-500 disabled:opacity-50"
                  >
                    <Send size={16} />
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>

              {/* Bottom Panel */}
              <div className="h-64 border-t border-zinc-800 grid grid-cols-2"></div>
            </div>
          </Panel>
        </PanelGroup>
      )}
    </div>
  );
}
