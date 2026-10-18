
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import { Send, Clock, Maximize2, Minimize2 } from "lucide-react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  timeLimit: number;
  maxAttempt: number;
  starterCode: string;
  hint: string;

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
  const [elapsedTime, setElapsedTime] = useState(0);
  const router = useRouter();

  const submittingRef = useRef(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Responsive panel direction
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateScreenSize = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);

    return () => {
      mediaQuery.removeEventListener("change", updateScreenSize);
    };
  }, []);

  const MySwal = useMemo(() => withReactContent(Swal), []);

  const handleSubmit = async () => {
    if (submittingRef.current || isSubmitted) return;

    try {
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

        <p style="margin-top:16px;font-weight:600;color:var(--primary);">
          Are you sure you want to continue?
        </p>
      </div>
    `,
        icon: "warning",
        width: 650,
        background: "var(--surface)",
        color: "var(--text)",
        showCancelButton: true,
        reverseButtons: true,
        focusCancel: true,
        confirmButtonText: "Yes, Submit",
        cancelButtonText: "Cancel",
        confirmButtonColor: "var(--primary)",
        cancelButtonColor: "var(--surface-hover)",
        customClass: {
          popup: "rounded-3xl",
          title: "text-2xl font-bold text-[var(--text)]",
          confirmButton: "rounded-xl px-6 py-3 font-semibold",
          cancelButton: "rounded-xl px-6 py-3 font-semibold text-[var(--text)]",
        },
      });

      if (!result.isConfirmed) return;

      submittingRef.current = true;
      setIsSubmitting(true);

      const res = await fetch("/api/solution_code_resubmit", {
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

      await MySwal.fire({
        icon: "success",
        title: "Submitted Successfully",
        text: "Your solution has been submitted for review.",
        confirmButtonColor: "var(--primary)",
      });

      router.replace("/pages/developer/coding_challenge_lists");

      return;
    } catch (error) {
      toast.error(String(error));

      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && code !== challenge.starterCode) {
        e.preventDefault();

        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [code, isSubmitted, challenge.starterCode]);

  useEffect(() => {
    if (!challenge.resubmit_start_at) return;

    const startedAt = new Date(challenge.resubmit_start_at).getTime();

    const updateTimer = () => {
      const now = Date.now();

      const elapsed = Math.floor((now - startedAt) / 1000);

      setElapsedTime(elapsed);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [challenge.resubmit_start_at]);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [elapsedTime]);

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* Main Layout */}
      {isFullscreen ? (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Toolbar */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
            <span className="text-sm font-medium sm:text-base">
              Fullscreen Mode
            </span>

            <button
              onClick={() => setIsFullscreen(false)}
              aria-label="Exit fullscreen"
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2 text-[var(--text)] transition-colors hover:bg-[var(--primary)] hover:text-white"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1">
            <Editor
              height="100%"
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
        </div>
      ) : (
        <PanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="min-h-0 flex-1"
        >
          {/* Left Problem Panel */}
          <Panel
            defaultSize={isMobile ? 38 : 35}
            minSize={isMobile ? 20 : 25}
          >
            <div className="flex h-full min-h-0 flex-col overflow-y-auto border-b border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 md:border-b-0 md:border-r">
              <h2 className="mb-3 text-lg font-semibold sm:text-xl">
                Problem Statement
              </h2>

              <p className="mb-5 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                {challenge.description}
              </p>

              <div className="mt-4 sm:mt-6">
                <h3 className="mb-2 font-semibold">Hint</h3>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 sm:p-4">
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[var(--text)] sm:text-base">
                    {challenge.hint}
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle
            className={`shrink-0 bg-[var(--border)] transition-colors hover:bg-[var(--primary)] ${
              isMobile
                ? "h-1 w-full cursor-row-resize"
                : "w-1 cursor-col-resize"
            }`}
          />

          {/* Right Editor Section */}
          <Panel defaultSize={isMobile ? 62 : 65} minSize={30}>
            <div className="flex h-full min-h-0 flex-col bg-[var(--surface)]">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
                <div className="flex min-w-0 flex-1 gap-3"></div>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2 text-[var(--text)] transition-colors hover:bg-[var(--primary)] hover:text-white"
                >
                  {isFullscreen ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
              </div>

              {/* Editor */}
              <div className="min-h-0 flex-1">
                <Editor
                  height="100%"
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
              <div className="flex shrink-0 flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="min-w-0">
                  <h1 className="break-words text-base font-bold sm:text-lg">
                    {challenge.title}
                  </h1>

                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {challenge.difficulty}
                  </p>
                </div>

                <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
                  <div className="flex min-w-0 items-center gap-2 text-[var(--primary)]">
                    <Clock size={18} className="shrink-0" />
                    <span className="font-mono text-sm tabular-nums sm:text-base">
                      {formattedTime}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting || isSubmitted}
                    className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-base"
                  >
                    <Send size={16} />
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>

              {/* Bottom Panel */}
              <div className="h-16 shrink-0 border-t border-[var(--border)] bg-[var(--surface)] sm:h-64">
                <div className="grid h-full grid-cols-2"></div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      )}
    </div>
  );
}
