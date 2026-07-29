"use client";

type Skill = {
  name: string;
  score: number;
  color: string;
};

const skills: Skill[] = [
  {
    name: "Frontend",
    score: 94,
    color: "bg-blue-500",
  },
  {
    name: "Backend",
    score: 82,
    color: "bg-green-500",
  },
  {
    name: "Problem Solving",
    score: 88,
    color: "bg-purple-500",
  },
  {
    name: "Database",
    score: 78,
    color: "bg-orange-500",
  },
  {
    name: "React.js",
    score: 95,
    color: "bg-cyan-500",
  },
  {
    name: "Node.js",
    score: 80,
    color: "bg-emerald-500",
  },
];

export default function SkillAnalytics() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Skill Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current verified skill performance.
          </p>
        </div>

        <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
          Overall 91%
        </span>
      </div>

      <div className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${skill.color}`}
                />

                <h3 className="font-medium text-slate-700">
                  {skill.name}
                </h3>
              </div>

              <span className="font-bold text-slate-900">
                {skill.score}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${skill.color} transition-all duration-700`}
                style={{
                  width: `${skill.score}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-100 p-5">
          <p className="text-sm text-slate-500">
            Strongest Skill
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            React.js
          </h3>

          <p className="mt-1 text-cyan-600 font-semibold">
            95%
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-5">
          <p className="text-sm text-slate-500">
            Needs Improvement
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            Database
          </h3>

          <p className="mt-1 text-orange-600 font-semibold">
            78%
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-5">
          <p className="text-sm text-slate-500">
            Overall Progress
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            Excellent
          </h3>

          <p className="mt-1 font-semibold text-green-600">
            +8% this month
          </p>
        </div>
      </div>
    </section>
  );
}