import {
  Award,
  Trophy,
  Medal,
  Star,
  Flame,
  ShieldCheck,
} from "lucide-react";

const achievements = [
  {
    title: "React Verified",
    description: "Completed all React assessments successfully.",
    icon: Award,
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "Problem Solver",
    description: "Solved 50+ coding challenges.",
    icon: Trophy,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    title: "Backend Expert",
    description: "High score in backend challenges.",
    icon: ShieldCheck,
    color: "text-green-600 bg-green-100",
  },
  {
    title: "Top Performer",
    description: "Maintained 90%+ average score.",
    icon: Star,
    color: "text-purple-600 bg-purple-100",
  },
  {
    title: "17 Day Streak",
    description: "Solved challenges continuously.",
    icon: Flame,
    color: "text-red-600 bg-red-100",
  },
  {
    title: "Elite Developer",
    description: "Earned multiple verified badges.",
    icon: Medal,
    color: "text-pink-600 bg-pink-100",
  },
];

export default function Achievements() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Achievements
        </h2>

        <p className="mt-2 text-slate-500">
          Milestones and badges earned throughout your
          SkillBridge journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-indigo-500 hover:shadow-lg"
            >
              <div
                className={`mb-5 inline-flex rounded-xl p-4 ${item.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}