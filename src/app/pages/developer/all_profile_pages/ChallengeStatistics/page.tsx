"use client";

import {
  Code2,
  LayoutDashboard,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Timer,
} from "lucide-react";

const statistics = [
  {
    title: "Coding Challenges",
    value: "48",
    subtitle: "Successfully Completed",
    icon: Code2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "UI Challenges",
    value: "21",
    subtitle: "Projects Submitted",
    icon: LayoutDashboard,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Approved",
    value: "63",
    subtitle: "Passed Reviews",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Pending Review",
    value: "6",
    subtitle: "Waiting for Review",
    icon: Clock3,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Average Attempts",
    value: "1.8",
    subtitle: "Per Challenge",
    icon: RotateCcw,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Average Time",
    value: "28 min",
    subtitle: "Challenge Completion",
    icon: Timer,
    color: "bg-cyan-100 text-cyan-600",
  },
];

export default function ChallengeStatistics() {
  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Challenge Statistics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overall challenge performance and review summary.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {statistics.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <h3 className="mt-3 text-4xl font-bold text-slate-900">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.subtitle}
                  </p>
                </div>

                <div
                  className={`rounded-2xl p-3 ${item.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>

              {/* Progress Line */}
              <div className="mt-6">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{
                      width: `${65 + index * 5}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}