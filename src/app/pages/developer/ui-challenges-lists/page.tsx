
"use client";

import LoadingUI from "@/components/Loadinui";
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
  maxAttempts: number;
  submit_attempts: number;
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

  const [meta, setMeta] = useState({
    counts: {
      available: 0,
      running: 0,
      completed: 0,
      runningResubmission: 0,
    },
  });

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
        api = `/api/developer_uichallenge/uichallenge-data?userId=${user.id}&status=pending`;
        break;

      case "completed":
        api = `/api/developer_uichallenge/uichallenge-data?userId=${user.id}&status=submitted`;
        break;

      case "running-resubmission":
        api = `/api/developer_uichallenge/uichallenge-data?userId=${user.id}&status=running-resubmission`;
        break;

      default:
        api = `/api/developer_uichallenge/uichallenge-data?userId=${user.id}&status=available`;
    }

    setLoading(true);

    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setMeta(res.meta);
        setLoading(false);
      });
  }, [challengeStatus, user?.id]);

  const handleStartChallenge = async (id: number) => {
    const result = await MySwal.fire({
      title: "Start Challenge",
      html: (
        <div
          className="mt-2 text-left"
          style={{ color: "var(--text)" }}
        >
          {/* Header */}
          <div
            className="mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border p-4"
            style={{
              background: "var(--surface-hover)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "var(--primary)",
                color: "#FFFFFF",
              }}
            >
              <TiStopwatch size={28} />
            </div>

            <div className="min-w-0">
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--text)" }}
              >
                Timer starts immediately
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Please read the instructions carefully before continuing.
              </p>
            </div>
          </div>

          {/* Rules */}
          <div
            className="rounded-xl border p-4"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <h4
              className="mb-3 font-semibold"
              style={{ color: "var(--text)" }}
            >
              Challenge Rules
            </h4>

            <ul
              className="space-y-3 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  <IoCheckmarkDone />
                </span>
                <span>
                  Your challenge timer will start immediately after clicking
                  <strong style={{ color: "var(--text)" }}>
                    {" "}Start Challenge
                  </strong>.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  <IoCheckmarkDone />
                </span>
                <span>
                  Complete and submit your solution before the time limit
                  expires.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  <CiWarning />
                </span>
                <span>
                  Once started, the timer{" "}
                  <strong style={{ color: "var(--text)" }}>
                    cannot be paused or reset.
                  </strong>
                </span>
              </li>

              <li
                className="flex items-start gap-3 rounded-lg border p-3"
                style={{
                  background: "var(--surface-hover)",
                  borderColor: "var(--border)",
                }}
              >
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  <RxCross2 />
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text)" }}
                >
                  If the time expires, your challenge will be submitted
                  automatically and you will receive{" "}
                  <strong>0 marks</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <p
            className="mt-5 text-center text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
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

      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--border)",

      width: "min(700px, 92vw)",

      background: "var(--surface)",
      color: "var(--text)",

      customClass: {
        popup: "rounded-3xl shadow-2xl",
        title: "text-xl sm:text-3xl font-bold pt-4",
        confirmButton:
          "rounded-xl px-4 sm:px-6 py-3 font-semibold",
        cancelButton:
          "rounded-xl px-4 sm:px-6 py-3 font-semibold",
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
        let title = "";
        let html = "";

        if (data.code === "PENDING_CHALLENGE") {
          title = "Challenge Already Running";

          html = `
      <div style="
        background:var(--surface-hover);
        border:1px solid var(--border);
        border-radius:14px;
        padding:18px;
        text-align:left;
        color:var(--text);
      ">
        <p style="margin:0;font-size:15px;color:var(--text-muted);">
          You currently have
          <strong style="color:var(--primary);">
            ${data.runningCount}
          </strong>
          active challenge${data.runningCount > 1 ? "s" : ""}.
        </p>

        <p style="margin-top:12px;font-size:14px;color:var(--text-muted);">
          Please submit ${
            data.runningCount > 1 ? "them" : "it"
          } before starting a new challenge.
        </p>
      </div>
    `;
        } else if (data.code === "ACTIVE_RESUBMISSION") {
          title = "Active Resubmission";

          html = `
      <div style="
        background:var(--surface-hover);
        border:1px solid var(--border);
        border-radius:14px;
        padding:18px;
        text-align:left;
        color:var(--text);
      ">
        <p style="margin:0;font-size:15px;color:var(--text-muted);">
          You currently have
          <strong style="color:var(--primary);">
            ${data.resubmitCount}
          </strong>
          active resubmission${data.resubmitCount > 1 ? "s" : ""}.
        </p>

        <p style="margin-top:12px;font-size:14px;color:var(--text-muted);">
          Please submit ${
            data.resubmitCount > 1 ? "them" : "it"
          } before starting a new challenge.
        </p>
      </div>
    `;
        } else {
          title = "Something went wrong";
          html = `<p>${data.message}</p>`;
        }

        Swal.fire({
          icon: "warning",
          title,
          html,
          confirmButtonText: "Got it",
          confirmButtonColor: "var(--primary)",
          width: "min(500px, 92vw)",
          background: "var(--surface)",
          color: "var(--text)",
          customClass: {
            popup: "rounded-3xl shadow-2xl",
            title: "text-xl sm:text-2xl font-bold",
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

      case "running-resubmission":
        return "Continue Resubmission";

      default:
        return "Start Now";
    }
  };

  const handleRunningChallenge = (id: number) => {
    router.push(`/pages/developer/ui-challenges-lists/${id}`);
  };

  const handleResubmitChallenge = async (id: number) => {
    const result = await MySwal.fire({
      title: "Start Resubmission",
      html: (
        <div
          className="mt-2 text-left"
          style={{ color: "var(--text)" }}
        >
          {/* Header */}
          <div
            className="mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border p-4"
            style={{
              background: "var(--surface-hover)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "var(--primary)",
                color: "#FFFFFF",
              }}
            >
              <TiStopwatch size={28} />
            </div>

            <div className="min-w-0">
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--text)" }}
              >
                Resubmission timer starts immediately
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Your resubmission session will begin as soon as you continue.
              </p>
            </div>
          </div>

          {/* Rules */}
          <div
            className="rounded-xl border p-4"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <h4
              className="mb-3 font-semibold"
              style={{ color: "var(--text)" }}
            >
              Resubmission Rules
            </h4>

            <ul
              className="space-y-3 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <li className="flex items-start gap-3">
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  <IoCheckmarkDone />
                </span>
                <span>
                  Your resubmission timer will start immediately after clicking
                  <strong style={{ color: "var(--text)" }}>
                    {" "}Start Resubmission
                  </strong>.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  <IoCheckmarkDone />
                </span>
                <span>
                  Update your previous solution and submit it when you are
                  ready.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  <CiWarning />
                </span>
                <span>
                  The resubmission timer{" "}
                  <strong style={{ color: "var(--text)" }}>
                    cannot be paused or reset.
                  </strong>
                </span>
              </li>

              <li
                className="flex items-start gap-3 rounded-lg border p-3"
                style={{
                  background: "var(--surface-hover)",
                  borderColor: "var(--border)",
                }}
              >
                <span
                  className="mt-1 shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  <RxCross2 />
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text)" }}
                >
                  Your resubmission time will be recorded and used during the
                  evaluation process.
                </span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <p
            className="mt-5 text-center text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Ready to improve your previous submission?
          </p>
        </div>
      ),

      icon: undefined,

      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,

      confirmButtonText: "Start Resubmission",
      cancelButtonText: "Cancel",

      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--border)",

      width: "min(700px, 92vw)",
      background: "var(--surface)",
      color: "var(--text)",

      customClass: {
        popup: "rounded-3xl shadow-2xl",
        title: "text-xl sm:text-3xl font-bold pt-4",
        confirmButton:
          "rounded-xl px-4 sm:px-6 py-3 font-semibold",
        cancelButton:
          "rounded-xl px-4 sm:px-6 py-3 font-semibold",
      },
    });

    if (result.isConfirmed) {
      const response = await fetch("/api/submission/resubmit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          challengeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Unable to Start Resubmission",
          text: data.message,
          confirmButtonColor: "var(--primary)",
          background: "var(--surface)",
          color: "var(--text)",
        });

        return;
      }

      router.push(`/pages/developer/ui-challenges-lists/${id}`);
    }
  };

  const handleAction = (challenge: Challenge) => {
    switch (challengeStatus) {
      case "running":
        handleRunningChallenge(challenge.id);
        break;

      case "completed":
        handleResubmitChallenge(challenge.id);
        break;

      case "running-resubmission":
        handleRunningChallenge(challenge.id);
        break;

      default:
        handleStartChallenge(challenge.id);
    }
  };

  const statusButtons = [
    {
      label: `All (${meta.counts.available})`,
      value: "available",
      show: true,
    },
    {
      label: `Running (${meta.counts.running})`,
      value: "running",
      show: meta.counts.running > 0,
    },
    {
      label: `Completed (${meta.counts.completed})`,
      value: "completed",
      show: meta.counts.completed > 0,
    },
    {
      label: `Running Resubmission (${meta.counts.runningResubmission})`,
      value: "running-resubmission",
      show: meta.counts.runningResubmission > 0,
    },
  ];

  const pageSubtitle = () => {
    switch (challengeStatus) {
      case "running":
        return "Continue and submit your active challenges before the deadline.";

      case "completed":
        return "Review your submitted challenges and start a resubmission if needed.";

      case "running-resubmission":
        return "Continue working on your active resubmissions and submit  as soon as possible .";

      default:
        return "Browse all available challenges and start your next assessment.";
    }
  };

  if (loading) {
    return <LoadingUI />;
  }

  return (
    <div
      className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Project Challenges
        </h1>

        <p
          className="mt-2 text-sm sm:text-base"
          style={{ color: "var(--text-muted)" }}
        >
          {pageSubtitle()}
        </p>

        {/* Status Filters */}
        <div className="mb-5 mt-5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {statusButtons
              .filter((item) => item.show)
              .map((item) => (
                <button
                  key={item.value}
                  onClick={() => setChallengeStatus(item.value)}
                  className="rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm"
                  style={
                    challengeStatus === item.value
                      ? {
                          background: "var(--primary)",
                          borderColor: "var(--primary)",
                          color: "#FFFFFF",
                        }
                      : {
                          background: "var(--surface)",
                          borderColor: "var(--border)",
                          color: "var(--text)",
                        }
                  }
                >
                  {item.label}
                </button>
              ))}

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors sm:px-4"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div
          className="mb-6 rounded-2xl border p-4 shadow-sm sm:p-6"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            className="mb-6 flex items-center justify-between gap-3 border-b pb-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <Filter
                className="h-5 w-5 shrink-0"
                style={{ color: "var(--primary)" }}
              />

              <h2 className="text-base font-semibold sm:text-lg">
                Filter Challenges
              </h2>
            </div>

            <button
              onClick={() => setShowFilter(false)}
              className="shrink-0 rounded-md p-2 transition-colors"
              style={{ color: "var(--text-muted)" }}
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Difficulty */}
            <div>
              <h3
                className="mb-3 text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                Difficulty
              </h3>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["All", "Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className="rounded-full border px-4 py-2 text-sm transition-colors"
                    style={
                      difficultyFilter === level
                        ? {
                            background: "var(--primary)",
                            borderColor: "var(--primary)",
                            color: "#FFFFFF",
                          }
                        : {
                            background: "var(--surface)",
                            borderColor: "var(--border)",
                            color: "var(--text)",
                          }
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Technology */}
            <div>
              <label
                className="mb-3 block text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                Technology
              </label>

              <select
                value={technologyFilter}
                onChange={(e) => setTechnologyFilter(e.target.value)}
                className="w-full min-w-0 rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  outlineColor: "var(--primary)",
                }}
              >
                {technologies.map((tech) => (
                  <option key={tech}>{tech}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="mt-8 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Filters are applied instantly.
            </p>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
              <button
                onClick={() => {
                  setDifficultyFilter("All");
                  setTechnologyFilter("All");
                }}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                Reset
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="rounded-lg px-5 py-2 text-sm font-medium transition-colors"
                style={{
                  background: "var(--primary)",
                  color: "#FFFFFF",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenges Table */}
      <div
        className="w-full overflow-hidden rounded-xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead
              style={{
                background: "var(--surface-hover)",
                color: "var(--text)",
              }}
            >
              <tr>
                <th className="p-3 text-sm font-semibold sm:p-4 sm:text-base">
                  Title
                </th>

                <th className="p-3 text-sm font-semibold sm:p-4 sm:text-base">
                  Technology
                </th>

                <th className="p-3 text-sm font-semibold sm:p-4 sm:text-base">
                  Difficulty
                </th>

                <th className="p-3 text-center text-sm font-semibold sm:p-4 sm:text-base">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((challenge) => (
                <tr
                  key={challenge.id}
                  className="border-t transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <td className="max-w-[260px] break-words p-3 text-sm sm:p-4 sm:text-base">
                    {challenge.title}
                  </td>

                  <td className="p-3 text-sm sm:p-4 sm:text-base">
                    {challenge.technology}
                  </td>

                  <td className="p-3 text-sm sm:p-4 sm:text-base">
                    {challenge.difficulty}
                  </td>

                  <td className="p-3 sm:p-4">
                    <div className="flex justify-center gap-3">
                      {challengeStatus === "completed" ? (
                        challenge.submit_attempts < challenge.maxAttempts ? (
                          <button
                            onClick={() =>
                              handleResubmitChallenge(challenge.id)
                            }
                            className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm"
                            style={{
                              background: "var(--primary)",
                              color: "#FFFFFF",
                            }}
                          >
                            Resubmit {challenge.submit_attempts} /{" "}
                            {challenge.maxAttempts}
                          </button>
                        ) : (
                          <span
                            className="whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm"
                            style={{
                              background: "var(--surface-hover)",
                              borderColor: "var(--border)",
                              color: "var(--text-muted)",
                            }}
                          >
                            Max Attempts Reached {challenge.submit_attempts} /{" "}
                            {challenge.maxAttempts}
                          </span>
                        )
                      ) : (
                        <button
                          onClick={() => handleAction(challenge)}
                          className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm"
                          style={{
                            background: "var(--primary)",
                            color: "#FFFFFF",
                          }}
                        >
                          {getButtonLabel()}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm sm:p-12 sm:text-base"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No challenges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
