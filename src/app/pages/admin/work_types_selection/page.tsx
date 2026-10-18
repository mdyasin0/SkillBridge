
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
    logic: "/pages/admin/problem_solving_works",
    project: "/pages/admin/project-works",
  };

  const handleContinue = () => {
    if (!selected) return;

    router.push(challengeRoutes[selected]);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-3 py-8 text-(--text) sm:px-6 sm:py-10 md:py-12">
      <h1 className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl">
        Select One Option
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Card 1 */}
        <div
          onClick={() => setSelected("logic")}
          className={`relative min-w-0 cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 sm:p-6 ${
            selected === "logic"
              ? "border-(--primary) bg-(--primary)/10 shadow-md"
              : "border-(--border) bg-(--surface) hover:border-(--primary)/60 hover:shadow-sm"
          }`}
        >
          <button
            type="button"
            aria-label="Learn about logic challenges"
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal("logic");
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--primary) sm:right-4 sm:top-4"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <h2 className="break-words pr-10 text-lg font-semibold sm:text-xl">
            problem-solving-works
          </h2>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setSelected("project")}
          className={`relative min-w-0 cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 sm:p-6 ${
            selected === "project"
              ? "border-(--primary) bg-(--primary)/10 shadow-md"
              : "border-(--border) bg-(--surface) hover:border-(--primary)/60 hover:shadow-sm"
          }`}
        >
          <button
            type="button"
            aria-label="Learn about project challenges"
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal("project");
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--primary) sm:right-4 sm:top-4"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <h2 className="break-words pr-10 text-lg font-semibold sm:text-xl">
            projects-works
          </h2>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className={`mt-7 w-full rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200 sm:mt-10 sm:text-lg ${
          selected
            ? "cursor-pointer bg-(--primary) text-white hover:bg-(--primary-hover) active:scale-[0.99]"
            : "cursor-not-allowed border border-(--border) bg-(--surface-hover) text-(--text-muted)"
        }`}
      >
        Continue
      </button>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5">
          <div className="relative my-auto max-h-[90dvh] w-full max-w-2xl overflow-x-hidden overflow-y-auto rounded-xl border border-(--border) bg-(--surface) p-4 text-(--text) shadow-xl sm:max-h-[85dvh] sm:p-6 md:p-7">
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setOpenModal(null)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--text) sm:right-4 sm:top-4"
            >
              <X className="h-5 w-5" />
            </button>

            {openModal === "logic" && (
              <>
                <h2 className="mb-2 pr-10 text-xl font-bold sm:text-2xl">
                  Logic Challenges
                </h2>

                <p className="mb-6 text-sm leading-6 text-(--text-muted) sm:text-base">
                  Solve algorithmic and programming challenges inside the
                  built-in code editor. Your submission is automatically
                  evaluated against hidden test cases, and the score is
                  generated instantly.
                </p>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Code2 className="h-5 w-5 shrink-0 text-(--primary)" />
                      <h3 className="font-semibold">
                        How it works
                      </h3>
                    </div>

                    <ul className="space-y-2 text-sm leading-6 text-(--text-muted)">
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
                      <CircleCheckBig className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold">
                        Evaluation Factors
                      </h3>
                    </div>

                    <ul className="grid grid-cols-1 gap-2 text-sm text-(--text-muted) sm:grid-cols-2">
                      <li>Test Cases</li>
                      <li>Execution Time</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Cpu className="h-5 w-5 shrink-0 text-(--primary)" />
                      <h3 className="font-semibold">
                        Supported Technologies
                      </h3>
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
                          className="max-w-full break-words rounded-md border border-(--border) bg-(--surface-hover) px-3 py-1.5 text-xs text-(--text-muted)"
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
                <h2 className="mb-2 pr-10 text-xl font-bold sm:text-2xl">
                  Project Challenges
                </h2>

                <p className="mb-6 text-sm leading-6 text-(--text-muted) sm:text-base">
                  Build real-world applications using your preferred technology
                  stack. Submit your GitHub repository and live deployment for
                  manual review by evaluators.
                </p>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <FileCode2 className="h-5 w-5 shrink-0 text-(--primary)" />
                      <h3 className="font-semibold">
                        How it works
                      </h3>
                    </div>

                    <ul className="space-y-2 text-sm leading-6 text-(--text-muted)">
                      <li>• Build the required application or feature.</li>
                      <li>• Upload your GitHub repository.</li>
                      <li>• Submit the live deployment URL.</li>
                      <li>• Reviewers evaluate your submission.</li>
                      <li>• Your final score is published after review.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <CircleCheckBig className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold">
                        Evaluation Factors
                      </h3>
                    </div>

                    <ul className="grid grid-cols-1 gap-2 text-sm text-(--text-muted) sm:grid-cols-2">
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
                      <Cpu className="h-5 w-5 shrink-0 text-(--primary)" />
                      <h3 className="font-semibold">
                        Supported Technologies
                      </h3>
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
                          className="max-w-full break-words rounded-md border border-(--border) bg-(--surface-hover) px-3 py-1.5 text-xs text-(--text-muted)"
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
