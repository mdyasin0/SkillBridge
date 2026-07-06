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
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6">
      <h1 className="mb-8 text-center text-3xl font-bold">Select One Option</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1 */}
        <div
          onClick={() => setSelected("logic")}
          className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all
          ${
            selected === "logic"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-400"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal("logic");
            }}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
          >
            <HelpCircle className="h-5 w-5 text-gray-500" />
          </button>

          <h2 className="text-xl font-semibold">Logic Challenge</h2>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setSelected("project")}
          className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all
          ${
            selected === "project"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-400"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenModal("project");
            }}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
          >
            <HelpCircle className="h-5 w-5 text-gray-500" />
          </button>

          <h2 className="text-xl font-semibold">Project Challenges</h2>
        </div>
      </div>

      <button
  onClick={handleContinue}
  disabled={!selected}
  className={`mt-10 rounded-lg py-3 text-lg font-semibold transition
  ${
    selected
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "cursor-not-allowed bg-gray-300 text-gray-500"
  }`}
>
  Continue
</button>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6">
            <button
              onClick={() => setOpenModal(null)}
              className="absolute right-4 top-4"
            >
              <X className="h-5 w-5" />
            </button>

            {openModal === "logic" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Logic Challenges</h2>

                <p className="mb-6 text-sm leading-6 text-gray-600">
                  Solve algorithmic and programming challenges inside the
                  built-in code editor. Your submission is automatically
                  evaluated against hidden test cases, and the score is
                  generated instantly.
                </p>

                <div className="space-y-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">How it works</h3>
                    </div>

                    <ul className="space-y-2 text-sm text-gray-600">
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
                      <CircleCheckBig className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Evaluation Factors</h3>
                    </div>

                    <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <li>Test Cases</li>
                      <li>Execution Time</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-violet-600" />
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
                          className="rounded-md border bg-gray-50 px-3 py-1 text-xs"
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
                <h2 className="mb-2 text-xl font-bold">Project Challenges</h2>

                <p className="mb-6 text-sm leading-6 text-gray-600">
                  Build real-world applications using your preferred technology
                  stack. Submit your GitHub repository and live deployment for
                  manual review by evaluators.
                </p>

                <div className="space-y-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <FileCode2 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">How it works</h3>
                    </div>

                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Build the required application or feature.</li>
                      <li>• Upload your GitHub repository.</li>
                      <li>• Submit the live deployment URL.</li>
                      <li>• Reviewers evaluate your submission.</li>
                      <li>• Your final score is published after review.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <CircleCheckBig className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Evaluation Factors</h3>
                    </div>

                    <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
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
                      <Cpu className="h-5 w-5 text-violet-600" />
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
                          className="rounded-md border bg-gray-50 px-3 py-1 text-xs"
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
