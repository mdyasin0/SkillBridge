
"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type FormData = {
  title: string;
  description: string;
  technology: string;
  difficulty: string;
  category: string;
  timeLimit: number;
  maxAttempts: number;
};

export default function ChallengeForm() {
  const technologies = [
    "React",
    "Next.js",
    "Angular",
    "Vue.js",
    "Express.js",
    "NestJS",
    "Docker",
    "Kubernetes",
    "AWS",
    "Git",
  ];

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    technology: "",
    difficulty: "",
    category: "",
    timeLimit: 30,
    maxAttempts: 3,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "timeLimit" || name === "maxAttempts"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/ui_challenge_manage/uichallengecreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.info(data.message);
        return;
      }

      toast.info(data.message);

      // Form Reset
      setFormData({
        title: "",
        description: "",
        technology: "",
        difficulty: "",
        category: "",
        timeLimit: 30,
        maxAttempts: 3,
      });
    } catch (error) {
      toast.error(String(error));
      toast.info("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
      <div
        className="w-full min-w-0 rounded-2xl border p-4 shadow-lg sm:p-6 md:p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 className="mb-6 text-2xl font-bold text-(--text) sm:mb-8 sm:text-3xl">
          Create-ui-challenge
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Title */}
          <div className="min-w-0">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-(--text) sm:text-base"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter challenge title"
              className="w-full min-w-0 rounded-xl border bg-(--bg-secondary) px-4 py-3 text-(--text) outline-none transition placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
              style={{
                borderColor: "var(--border)",
              }}
            />
          </div>

          {/* Description */}
          <div className="min-w-0">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-(--text) sm:text-base"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={6}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write challenge description..."
              className="w-full min-w-0 resize-y rounded-xl border bg-(--bg-secondary) px-4 py-3 text-(--text) outline-none transition placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
              style={{
                borderColor: "var(--border)",
              }}
            />
          </div>

          {/* Grid */}
          <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
            {/* Technology */}
            <div className="min-w-0">
              <label
                htmlFor="technology"
                className="mb-2 block text-sm font-medium text-(--text) sm:text-base"
              >
                Technology
              </label>

              <select
                id="technology"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                className="w-full min-w-0 rounded-xl border bg-(--bg-secondary) px-4 py-3 text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <option value="">Select Technology</option>

                {technologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="min-w-0">
              <label
                htmlFor="difficulty"
                className="mb-2 block text-sm font-medium text-(--text) sm:text-base"
              >
                Difficulty
              </label>

              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full min-w-0 rounded-xl border bg-(--bg-secondary) px-4 py-3 text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <option value="">Select Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Category */}
            <div className="min-w-0">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-(--text) sm:text-base"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Algorithms"
                className="w-full min-w-0 rounded-xl border bg-(--bg-secondary) px-4 py-3 text-(--text) outline-none transition placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
                style={{
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Time Limit */}
            <div className="min-w-0">
              <label
                htmlFor="timeLimit"
                className="mb-2 block text-sm font-medium text-(--text) sm:text-base"
              >
                Time Limit (Minutes)
              </label>

              <input
                id="timeLimit"
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full min-w-0 rounded-xl border bg-(--bg-secondary) px-4 py-3 text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
                style={{
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Max Attempts */}
            <div className="min-w-0">
              <label
                htmlFor="maxAttempts"
                className="mb-2 block text-sm font-medium text-(--text) sm:text-base"
              >
                Max Attempts
              </label>

              <input
                id="maxAttempts"
                type="number"
                name="maxAttempts"
                value={formData.maxAttempts}
                onChange={handleChange}
                className="w-full min-w-0 rounded-xl border bg-(--bg-secondary) px-4 py-3 text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)"
                style={{
                  borderColor: "var(--border)",
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-(--primary) px-6 py-3 font-semibold text-white transition-colors hover:bg-(--primary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-48 sm:px-8"
            >
              {loading ? "Creating..." : "Create Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
