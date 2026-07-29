import { CheckCircle2, Clock3, Star } from "lucide-react";

const challengeHistory = [
  {
    id: 1,
    challenge: "React Todo Application",
    type: "UI Challenge",
    difficulty: "Medium",
    score: 95,
    status: "Approved",
    date: "22 Jul 2026",
  },
  {
    id: 2,
    challenge: "Binary Search",
    type: "Coding",
    difficulty: "Easy",
    score: 100,
    status: "Approved",
    date: "18 Jul 2026",
  },
  {
    id: 3,
    challenge: "Node Authentication API",
    type: "UI Challenge",
    difficulty: "Hard",
    score: 88,
    status: "Pending",
    date: "15 Jul 2026",
  },
];

const feedbacks = [
  {
    id: 1,
    title: "React Todo Application",
    reviewer: "Admin",
    score: 95,
    feedback:
      "Excellent component structure and clean UI implementation. Keep improving code optimization.",
  },
  {
    id: 2,
    title: "Binary Search",
    reviewer: "Admin",
    score: 100,
    feedback:
      "Perfect solution. Fast execution and correct logic.",
  },
];

export default function ChallengeHistorySection() {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-6 space-y-8">

      {/* Challenge History */}

      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            Challenge History
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            All completed coding and UI challenges.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-5 py-4 text-left">Challenge</th>
                <th className="px-5 py-4 text-left">Type</th>
                <th className="px-5 py-4 text-left">Difficulty</th>
                <th className="px-5 py-4 text-left">Score</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Completed</th>
              </tr>
            </thead>

            <tbody>
              {challengeHistory.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-5 py-4 font-medium">
                    {item.challenge}
                  </td>

                  <td className="px-5 py-4">
                    {item.type}
                  </td>

                  <td className="px-5 py-4">
                    {item.difficulty}
                  </td>

                  <td className="px-5 py-4 font-semibold text-indigo-600">
                    {item.score}
                  </td>

                  <td className="px-5 py-4">
                    {item.status === "Approved" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        <CheckCircle2 size={15} />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                        <Clock3 size={15} />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Feedback */}

      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            Latest Admin Feedback
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Reviews received from challenge evaluators.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border p-5 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={18} fill="currentColor" />
                  {item.score}
                </div>
              </div>

              <p className="mt-3 text-slate-600 leading-7">
                {item.feedback}
              </p>

              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <span className="text-sm text-slate-500">
                  Reviewed By
                </span>

                <span className="font-semibold">
                  {item.reviewer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}