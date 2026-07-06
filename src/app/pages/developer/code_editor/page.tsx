"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

import { Play, Send, Clock, Maximize2, Minimize2 } from "lucide-react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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

  const [isFullscreen, setIsFullscreen] = useState(false);
const [output, setOutput] = useState("");
const handleRun = () => {

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
                    <span>{challenge.timeLimit}</span>
                  </div>

                  <button
                    onClick={handleRun}
                    className="bg-zinc-800 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-700"
                  >
                    <Play size={16} />
                    Run Code
                  </button>

                  <button className="bg-green-600 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-green-500">
                    <Send size={16} />
                    Submit
                  </button>
                </div>
              </div>

              {/* Bottom Panel */}
              <div className="h-64 border-t border-zinc-800 grid grid-cols-2">
                {/* Console */}
                <div className="border-r border-zinc-800 p-4">
                  <h3 className="font-semibold text-lg mb-4">Console Output</h3>

                  <div className="bg-black rounded-xl p-4 h-45 overflow-auto">
                    <pre className="text-green-400 text-sm whitespace-pre-wrap">
                          {output}
                    </pre>
                  </div>
                </div>

                {/* Test Cases */}
                <div className="p-4 overflow-y-auto">
                  <h3 className="font-semibold text-lg mb-4">
                    Sample Test Cases
                  </h3>

                  <div className="space-y-4">
                    {challenge.testCases.map((test, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-zinc-700 bg-zinc-900 p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">
                            Test Case #{index + 1}
                          </h4>

                          <span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white">
                            Sample
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs uppercase text-zinc-400 mb-1">
                              Input
                            </p>

                            <pre className="bg-black rounded-lg p-3 text-sm overflow-x-auto">
                              {test.input}
                            </pre>
                          </div>

                          <div>
                            <p className="text-xs uppercase text-zinc-400 mb-1">
                              Expected Output
                            </p>

                            <pre className="bg-black rounded-lg p-3 text-green-400 text-sm overflow-x-auto">
                              {test.output}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      )}
    </div>
  );
}
