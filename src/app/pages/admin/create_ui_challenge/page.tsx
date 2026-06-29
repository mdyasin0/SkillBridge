"use client";

import { useState } from "react";

type FormData = {
  title: string;
  description: string;
  technology: string;
  difficulty: string;
  category: string;
  timeLimit: number;
  maxAttempts: number;
  rewardBadge: string;
};

export default function ChallengeForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    technology: "",
    difficulty: "",
    category: "",
    timeLimit: 30,
    maxAttempts: 3,
    rewardBadge: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    const res = await fetch("/api/uichallenge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);

    // Form Reset
    setFormData({
      title: "",
      description: "",
      technology: "",
      difficulty: "",
      category: "",
      timeLimit: 30,
      maxAttempts: 3,
      rewardBadge: "",
    });
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div
        className="rounded-2xl border p-8 shadow-lg"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 className="text-3xl font-bold mb-8">
          Create Challenge
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter challenge title"
              className="w-full rounded-xl border px-4 py-3 outline-none transition"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={6}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write challenge description..."
              className="w-full rounded-xl border px-4 py-3 outline-none resize-none transition"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Technology */}
            <div>
              <label className="block mb-2 font-medium">
                Technology
              </label>

              <input
                type="text"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                placeholder="React / Node / Python"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block mb-2 font-medium">
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  background: "var(--bg-secondary)",
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
            <div>
              <label className="block mb-2 font-medium">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Algorithms"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Time Limit */}
            <div>
              <label className="block mb-2 font-medium">
                Time Limit (Minutes)
              </label>

              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Max Attempts */}
            <div>
              <label className="block mb-2 font-medium">
                Max Attempts
              </label>

              <input
                type="number"
                name="maxAttempts"
                value={formData.maxAttempts}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Reward Badge */}
            <div>
              <label className="block mb-2 font-medium">
                Reward Badge
              </label>

              <input
                type="text"
                name="rewardBadge"
                value={formData.rewardBadge}
                onChange={handleChange}
                placeholder="Gold Badge"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>
          </div>

          <div className="pt-4">
          <button
  type="submit"
  disabled={loading}
  className="rounded-xl px-8 py-3 font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
  style={{
    background: "var(--primary)",
  }}
  onMouseOver={(e) =>
    (e.currentTarget.style.background = "var(--primary-hover)")
  }
  onMouseOut={(e) =>
    (e.currentTarget.style.background = "var(--primary)")
  }
>
  {loading ? "Creating..." : "Create Challenge"}
</button>
          </div>
        </form>
      </div>
    </div>
  );
}