"use client";

import {
  TrendingUp,
  CalendarDays,
  Target,
  ArrowUpRight,
} from "lucide-react";

const scoreHistory = [
  { month: "Jan", score: 62 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 76 },
  { month: "Apr", score: 81 },
  { month: "May", score: 89 },
  { month: "Jun", score: 92 },
];

const monthlyActivity = [
  {
    title: "Challenges Completed",
    value: 18,
    color: "bg-blue-500",
  },
  {
    title: "Average Score",
    value: "91%",
    color: "bg-green-500",
  },
  {
    title: "Earned Badges",
    value: 3,
    color: "bg-yellow-500",
  },
];

const challengeCompletion = [
  {
    title: "Coding",
    value: 42,
    total: 50,
  },
  {
    title: "UI",
    value: 18,
    total: 20,
  },
  {
    title: "Projects",
    value: 7,
    total: 10,
  },
];

export default function PerformanceOverview() {
  return (
    <section className="mt-10 space-y-8">

      <div className="flex items-center gap-3">
        <TrendingUp className="text-indigo-600" />
        <h2 className="text-2xl font-bold">
          Performance Overview
        </h2>
      </div>

      {/* Top Cards */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Score History */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h3 className="font-semibold text-slate-900">
                Score History
              </h3>

              <p className="text-sm text-slate-500">
                Monthly performance improvement
              </p>

            </div>

            <ArrowUpRight className="text-green-500" />

          </div>

          <div className="flex h-52 items-end justify-between gap-4">

            {scoreHistory.map((item) => (
              <div
                key={item.month}
                className="flex flex-1 flex-col items-center"
              >
                <div
                  className="w-full rounded-t-xl bg-indigo-500 transition-all hover:bg-indigo-600"
                  style={{
                    height: `${item.score * 1.5}px`,
                  }}
                />

                <span className="mt-3 text-sm font-medium">
                  {item.month}
                </span>

                <span className="text-xs text-slate-500">
                  {item.score}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* Monthly Activity */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-2">

            <CalendarDays className="text-indigo-600" />

            <h3 className="font-semibold">
              Monthly Activity
            </h3>

          </div>

          <div className="space-y-5">

            {monthlyActivity.map((item) => (

              <div
                key={item.title}
                className="rounded-xl bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    {item.title}
                  </span>

                  <div
                    className={`h-3 w-3 rounded-full ${item.color}`}
                  />

                </div>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Challenge Completion */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-2">

          <Target className="text-indigo-600" />

          <h3 className="text-xl font-semibold">
            Challenge Completion
          </h3>

        </div>

        <div className="space-y-6">

          {challengeCompletion.map((item) => {

            const percent =
              (item.value / item.total) * 100;

            return (

              <div key={item.title}>

                <div className="mb-2 flex justify-between">

                  <span className="font-medium">
                    {item.title}
                  </span>

                  <span className="text-sm text-slate-500">
                    {item.value}/{item.total}
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-200">

                  <div
                    className="h-3 rounded-full bg-indigo-600"
                    style={{
                      width: `${percent}%`,
                    }}
                  />

                </div>

              </div>

            );
          })}

        </div>

      </div>

    </section>
  );
}