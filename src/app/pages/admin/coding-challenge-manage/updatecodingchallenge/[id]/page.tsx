"use client";

import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

type TestCase = {
  input: string;
  output: string;
  visible: boolean;
};

export default function ProblemForm() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "React",
    allowedLanguages: ["JavaScript"],
    timeLimit: 1000,
    maxAttempt: 5,
    starterCode: "",
    hint: "",
    rewardBadge: "",
  });

  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      input: "",
      output: "",
      visible: true,
    },
  ]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "timeLimit" || name === "maxAttempt" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`/api/coding_challenge-manage/all_coding_challenge/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch challenge");
        }

        const data = await res.json();

        setFormData({
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          category: data.category,
          allowedLanguages: data.allowedLanguages,
          timeLimit: data.timeLimit,
          maxAttempt: data.maxAttempt,
          starterCode: data.starterCode,
          hint: data.hint,
          rewardBadge: data.rewardBadge,
        });

        setTestCases(data.testCases);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChallenge();
  }, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`/api/coding_challenge-manage/updatecodingchallenge/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          testCases,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update challenge");
      }
      router.push("/pages/admin/coding-challenge-manage/coding_challenge_lists");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto bg-(--surface) rounded-3xl shadow-(--shadow) border border-(--border) p-10">
      <h1 className="text-3xl font-bold mb-8">Create Coding Problem</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}

        <div>
          <label className="font-semibold mb-2 block">Title</label>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
            className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
          />
        </div>

        {/* Description */}

        <div>
          <label className="font-semibold mb-2 block">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
          />
        </div>

        {/* Row */}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label>Difficulty</label>

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
            >
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Algorithm">Algorithm</option>
              <option value="Database">Database</option>
            </select>
          </div>

          <div className="space-y-2">
            <label>Allowed Language</label>

            <select
              value={formData.allowedLanguages[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  allowedLanguages: [e.target.value],
                })
              }
              className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
            </select>
          </div>
        </div>

        {/* Time */}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label>Time Limit (ms)</label>

            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
            />
          </div>

          <div className="space-y-2">
            <label>Max Attempt</label>

            <input
              type="number"
              name="maxAttempt"
              value={formData.maxAttempt}
              onChange={handleChange}
              className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
            />
          </div>
        </div>

        {/* Starter */}

        <div className="space-y-2">
          <label>Starter Code</label>

          <textarea
            rows={10}
            name="starterCode"
            value={formData.starterCode}
            onChange={handleChange}
            placeholder="// Write starter code..."
            className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
          />
        </div>

        {/* Hint */}

        <div className="space-y-2">
          <label>Hint</label>

          <textarea
            rows={4}
            name="hint"
            value={formData.hint}
            onChange={handleChange}
            placeholder="Helpful hint..."
            className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
          />
        </div>

        {/* Badge */}

        <div className="space-y-2">
          <label>Reward Badge</label>

          <input
            type="text"
            name="rewardBadge"
            value={formData.rewardBadge}
            onChange={handleChange}
            placeholder="Gold / Silver / Bronze"
            className="w-full rounded-xl border border-(--border) bg-(--bg) p-3"
          />
        </div>

        {/* Test Cases */}

        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Test Cases</h2>
          </div>

          <div className="space-y-6">
            {testCases.map((tc, index) => (
              <div key={index}>
                <input
                  value={tc.input}
                  onChange={(e) => {
                    const updated = [...testCases];
                    updated[index].input = e.target.value;
                    setTestCases(updated);
                  }}
                />

                <input
                  value={tc.output}
                  onChange={(e) => {
                    const updated = [...testCases];
                    updated[index].output = e.target.value;
                    setTestCases(updated);
                  }}
                />

                <input
                  type="checkbox"
                  checked={tc.visible}
                  onChange={(e) => {
                    const updated = [...testCases];
                    updated[index].visible = e.target.checked;
                    setTestCases(updated);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-(--primary) py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Updating Challenge..." : "Update Challenge"}
        </button>
      </form>
    </div>
  );
}
