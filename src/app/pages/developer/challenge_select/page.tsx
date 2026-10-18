
"use client";

import { useState } from "react";
import {
  HelpCircle,
  X,
  CircleCheckBig,
  Code2,
  FileCode2,
  Cpu,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Option = "logic" | "project" | null;

export default function SelectOptionPage() {
  const [selected, setSelected] = useState<Option>(null);
  const [openModal, setOpenModal] = useState<Option>(null);
  const router = useRouter();

  const challengeRoutes = {
    logic: "/pages/developer/coding_challenge_lists",
    project: "/pages/developer/ui-challenges-lists",
  };

  const handleContinue = () => {
    if (!selected) return;

    router.push(challengeRoutes[selected]);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-center text-2xl font-bold text-[var(--text)] sm:mb-8 sm:text-3xl">
        Select One Option
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Card 1 */}
        <div
          onClick={() => setSelected("logic")}
          className={`relative min-w-0 cursor-pointer rounded-xl border-2 p-5 transition-all sm:p-6 ${
            selected === "logic"
              ? "border-[var(--primary)] bg-[var(--surface-hover)]"
              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal("logic");
            }}
            aria-label="Logic Challenge information"
            className="absolute right-3 top-3 rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] sm:right-4 sm:top-4"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <h2 className="pr-9 text-lg font-semibold text-[var(--text)] sm:text-xl">
            Logic Challenge
          </h2>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setSelected("project")}
          className={`relative min-w-0 cursor-pointer rounded-xl border-2 p-5 transition-all sm:p-6 ${
            selected === "project"
              ? "border-[var(--primary)] bg-[var(--surface-hover)]"
              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal("project");
            }}
            aria-label="Project Challenges information"
            className="absolute right-3 top-3 rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] sm:right-4 sm:top-4"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <h2 className="pr-9 text-lg font-semibold text-[var(--text)] sm:text-xl">
            Project Challenges
          </h2>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className={`mt-7 w-full rounded-lg px-4 py-3 text-base font-semibold transition sm:mt-10 sm:text-lg ${
          selected
            ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            : "cursor-not-allowed bg-[var(--surface-hover)] text-[var(--text-muted)]"
        }`}
      >
        Continue
      </button>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="relative my-auto max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--text)] shadow-[var(--shadow)] sm:max-h-[85vh] sm:p-6">
            <button
              onClick={() => setOpenModal(null)}
              aria-label="Close modal"
              className="absolute right-3 top-3 rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] sm:right-4 sm:top-4"
            >
              <X className="h-5 w-5" />
            </button>

            {openModal === "logic" && (
              <>
                <h2 className="mb-2 pr-10 text-lg font-bold sm:text-xl">
                  Logic Challenges
                </h2>

                <p className="mb-6 text-sm leading-6 text-[var(--text-muted)]">
                  Solve algorithmic and programming challenges inside the
                  built-in code editor. Your submission is automatically
                  evaluated against hidden test cases, and the score is
                  generated instantly.
                </p>

                <div className="space-y-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Code2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                      <h3 className="font-semibold">How it works</h3>
                    </div>

                    <ul className="space-y-2 text-sm leading-6 text-[var(--text-muted)]">
                      <li>
                        • Solve the challenge using the integrated code editor.
                      </li>
                      <li>• Submit your solution for evaluation.</li>
                      <li>• Hidden test cases run automatically.</li>
                      <li>• Your score is generated instantly.</li>
                      <li>• Retry based on the maximum attempt limit.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <CircleCheckBig className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                      <h3 className="font-semibold">Evaluation Factors</h3>
                    </div>

                    <ul className="grid grid-cols-1 gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-2">
                      <li>Test Cases</li>
                      <li>Execution Time</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Cpu className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                      <h3 className="font-semibold">Supported Technologies</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "JavaScript",
                        "TypeScript",
                        "Python",
                        "Java",
                        "C++",
                        "Go",
                        "SQL",
                        "MongoDB",
                        "Node.js",
                        "Data Structures & Algorithms",
                      ].map((item) => (
                        <span
                          key={item}
                          className="max-w-full break-words rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1 text-xs text-[var(--text)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {openModal === "project" && (
              <>
                <h2 className="mb-2 pr-10 text-lg font-bold sm:text-xl">
                  Project Challenges
                </h2>

                <p className="mb-6 text-sm leading-6 text-[var(--text-muted)]">
                  Build real-world applications using your preferred technology
                  stack. Submit your GitHub repository and live deployment for
                  manual review by evaluators.
                </p>

                <div className="space-y-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <FileCode2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                      <h3 className="font-semibold">How it works</h3>
                    </div>

                    <ul className="space-y-2 text-sm leading-6 text-[var(--text-muted)]">
                      <li>• Build the required application or feature.</li>
                      <li>• Upload your GitHub repository.</li>
                      <li>• Submit the live deployment URL.</li>
                      <li>• Reviewers evaluate your submission.</li>
                      <li>• Your final score is published after review.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <CircleCheckBig className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                      <h3 className="font-semibold">Evaluation Factors</h3>
                    </div>

                    <ul className="grid grid-cols-1 gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-2">
                      <li>UI Accuracy</li>
                      <li>Responsive Design</li>
                      <li>Code Quality</li>
                      <li>Folder Structure</li>
                      <li>Best Practices</li>
                      <li>Functionality</li>
                      <li>Performance</li>
                      <li>Documentation</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Cpu className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                      <h3 className="font-semibold">Supported Technologies</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "Next.js",
                        "Angular",
                        "Vue.js",
                        "Express.js",
                        "NestJS",
                        "Docker",
                        "Kubernetes",
                        "AWS",
                        "Git",
                      ].map((item) => (
                        <span
                          key={item}
                          className="max-w-full break-words rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1 text-xs text-[var(--text)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
