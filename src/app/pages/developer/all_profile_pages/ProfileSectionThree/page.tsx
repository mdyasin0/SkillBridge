"use client";

import {
  Award,
  CheckCircle2,
  Trophy,
  Rocket,
  Clock3,
  ArrowRight,
  Activity,
  Star,
} from "lucide-react";

export default function ProfileSectionThree() {
  const badges = [
    {
      title: "React Verified",
      color: "bg-blue-100 text-blue-700",
      icon: <Award size={20} />,
    },
    {
      title: "Backend Verified",
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={20} />,
    },
    {
      title: "Problem Solver",
      color: "bg-purple-100 text-purple-700",
      icon: <Trophy size={20} />,
    },
    {
      title: "UI Challenge Master",
      color: "bg-pink-100 text-pink-700",
      icon: <Star size={20} />,
    },
    {
      title: "Consistency Badge",
      color: "bg-orange-100 text-orange-700",
      icon: <Rocket size={20} />,
    },
  ];

  const activities = [
    {
      title: "Completed React Dashboard Challenge",
      time: "2 hours ago",
    },
    {
      title: "Received Review • Score 94/100",
      time: "Yesterday",
    },
    {
      title: "Earned Backend Verified Badge",
      time: "2 days ago",
    },
    {
      title: "Completed Problem Solving Challenge",
      time: "3 days ago",
    },
  ];

  return (
    <div className="mx-auto mt-10 max-w-7xl space-y-8 px-6">

      {/* ================= VERIFIED BADGES ================= */}

      <section className="rounded-3xl bg-white p-8 shadow-sm">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Verified Badges
            </h2>

            <p className="text-slate-500">
              Badges earned from verified assessments.
            </p>
          </div>

          <Award className="text-indigo-600" size={34} />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${badge.color}`}
              >
                {badge.icon}
              </div>

              <h3 className="font-semibold text-slate-900">
                {badge.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Successfully verified by completing platform assessments.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RUNNING CHALLENGE ================= */}

      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-lg">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Current Running Challenge
            </h2>

            <p className="mt-2 text-indigo-100">
              Full Stack E-Commerce Dashboard
            </p>

            <div className="mt-6 flex items-center gap-2">

              <Clock3 size={18} />

              <span className="text-lg font-semibold">
                Remaining Time:
              </span>

              <span className="rounded-lg bg-white/20 px-3 py-1 font-bold">
                01 : 26 : 48
              </span>

            </div>

          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:bg-slate-100">
            Continue Challenge
            <ArrowRight size={18} />
          </button>

        </div>

      </section>

      {/* ================= RECENT ACTIVITY ================= */}

      <section className="rounded-3xl bg-white p-8 shadow-sm">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="text-slate-500">
              Your latest platform activities.
            </p>

          </div>

          <Activity className="text-indigo-600" size={30} />

        </div>

        <div className="space-y-5">

          {activities.map((item, index) => (

            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50"
            >

              <div className="mt-1 rounded-full bg-green-100 p-2">
                <CheckCircle2
                  size={18}
                  className="text-green-600"
                />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.time}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>
    </div>
  );
}