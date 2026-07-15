"use client";

import { useAuth } from "@/context/AuthContext";
import { Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { IoCheckmarkDone } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { TiStopwatch } from "react-icons/ti";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type Challenge = {
  id: number;
  title: string;
  technology: string;
  difficulty: string;
};

export default function UIChallengesPage() {
  const [data, setData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState("available");
  const { user } = useAuth();
  const router = useRouter();
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const MySwal = withReactContent(Swal);
  const [technologyFilter, setTechnologyFilter] = useState("All");
  const technologies = ["All", ...new Set(data.map((item) => item.technology))];

  const filteredData = data.filter((item) => {
    const difficultyMatch =
      difficultyFilter === "All" || item.difficulty === difficultyFilter;

    const technologyMatch =
      technologyFilter === "All" || item.technology === technologyFilter;

    return difficultyMatch && technologyMatch;
  });
  useEffect(() => {
    if (!user?.id) return;

    let api = "";

    switch (challengeStatus) {
      case "running":
        api = `/api/submission/all?userId=${user.id}&status=pending`;
        break;

      case "completed":
        api = `/api/submission/all?userId=${user.id}&status=submitted`;
        break;

      default:
        api = `/api/ui_challenge_manage/uichallengedata?userId=${user.id}`;
    }

    setLoading(true);

    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, [challengeStatus, user?.id]);
  const handleStartChallenge = async (id: number) => {
    const result = await MySwal.fire({
      title: "Start Challenge",
      html: (
        <div className="mt-2 text-left">
          {/* Header */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5B6CFF] text-white">
              <TiStopwatch size={28} />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Timer starts immediately
              </h3>
              <p className="text-sm text-slate-500">
                Please read the instructions carefully before continuing.
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 font-semibold text-slate-800">
              Challenge Rules
            </h4>

            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-green-500">
                  <IoCheckmarkDone />
                </span>
                <span>
                  Your challenge timer will start immediately after clicking
                  <strong> Start Challenge</strong>.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 text-green-500">
                  <IoCheckmarkDone />
                </span>
                <span>
                  Complete and submit your solution before the time limit
                  expires.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">
                  <CiWarning />
                </span>
                <span>
                  Once started, the timer{" "}
                  <strong>cannot be paused or reset.</strong>
                </span>
              </li>

              <li className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <span className="mt-1 text-red-500">
                  <RxCross2 />
                </span>
                <span className="font-medium text-red-700">
                  If the time expires, your challenge will be submitted
                  automatically and you will receive <strong>0 marks</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-sm font-medium text-[#5B6CFF]">
            Are you ready to prove your skills?
          </p>
        </div>
      ),

      icon: undefined,

      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,

      confirmButtonText: " Start Challenge",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#5B6CFF",
      cancelButtonColor: "#E2E8F0",

      width: 700,

      background: "#FFFFFF",

      customClass: {
        popup: "rounded-3xl shadow-2xl",
        title: "text-3xl font-bold text-slate-900 pt-4",
        confirmButton: "rounded-xl px-6 py-3 font-semibold text-white",
        cancelButton: "rounded-xl px-6 py-3 font-semibold text-slate-700",
      },
    });

    if (result.isConfirmed) {
      const response = await fetch("/api/submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          challengeId: id,
          challengeType: "project",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "warning",
          title: "Challenge Already Running",
          html: `
      <div style="
        background:#F8FAFC;
        border:1px solid #E2E8F0;
        border-radius:14px;
        padding:18px;
        text-align:left;
      ">
        <p style="margin:0;font-size:15px;color:#475569;">
          You currently have
          <strong style="color:#5B6CFF;">
            ${data.runningCount}
          </strong>
          active challenge${data.runningCount > 1 ? "s" : ""}.
        </p>

        <p style="margin-top:12px;font-size:14px;color:#64748B;">
          Please submit your current challenge before starting a new one.
        </p>
      </div>
    `,
          confirmButtonText: "Got it",
          confirmButtonColor: "#5B6CFF",
          width: 500,
          customClass: {
            popup: "rounded-3xl shadow-2xl",
            title: "text-2xl font-bold text-slate-900",
            confirmButton: "rounded-xl px-6 py-3 font-semibold",
          },
        });

        return;
      }

      router.push(`/pages/developer/ui-challenges-lists/${id}`);
    }
  };

  const getButtonLabel = () => {
    switch (challengeStatus) {
      case "running":
        return "Submit Now";

      case "completed":
        return "Resubmit";

      default:
        return "Start Now";
    }
  };
  const handleRunningChallenge = (id: number) => {
    router.push(`/pages/developer/ui-challenges-lists/${id}`);
  };
  const handleResubmitChallenge = (id: number) => {
    router.push(`/pages/developer/ui-challenges-lists/${id}/resubmit`);
  };
  const handleAction = (challenge: Challenge) => {
    switch (challengeStatus) {
      case "running":
        handleRunningChallenge(challenge.id);
        break;

      case "completed":
        handleResubmitChallenge(challenge.id);
        break;

      default:
        handleStartChallenge(challenge.id);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects Challenges</h1>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 rounded-lg border px-4 py-2"
        >
          <Filter size={18} />
          Filter
        </button>
      </div>
      {showFilter && (
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Filter Challenges</h2>
            </div>

            <button
              onClick={() => setShowFilter(false)}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Challenge Status
            </h3>

            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: "Available",
                  value: "available",
                },
                {
                  label: "Running",
                  value: "running",
                },
                {
                  label: "Completed",
                  value: "completed",
                },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setChallengeStatus(item.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    challengeStatus === item.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {/* Difficulty */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Difficulty
              </h3>

              <div className="flex flex-wrap gap-3">
                {["All", "Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      difficultyFilter === level
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Technology */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Technology
              </label>

              <select
                value={technologyFilter}
                onChange={(e) => setTechnologyFilter(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              >
                {technologies.map((tech) => (
                  <option key={tech}>{tech}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-between  border-t pt-4">
            <p className="text-sm text-gray-500">
              Filters are applied instantly.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setChallengeStatus("available");
                  setDifficultyFilter("All");
                  setTechnologyFilter("All");
                }}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="rounded-xl overflow-hidden border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <table className="w-full">
          <thead
            style={{
              background: "var(--surface-hover)",
            }}
          >
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Technology</th>
              <th className="text-left p-4">Difficulty</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((challenge) => (
              <tr
                key={challenge.id}
                className="border-t"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <td className="p-4">{challenge.title}</td>

                <td className="p-4">{challenge.technology}</td>

                <td className="p-4">{challenge.difficulty}</td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleAction(challenge)}
                      className="px-4 py-2 rounded-lg text-white"
                      style={{
                        background: "var(--primary)",
                      }}
                    >
                      {getButtonLabel()}
                    </button>{" "}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
