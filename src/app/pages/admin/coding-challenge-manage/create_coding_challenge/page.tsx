"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ProblemForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "React",
    timeLimit: 1000,
    maxAttempt: 5,
    starterCode: "",
    hint: "",
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
        name === "timeLimit" || name === "maxAttempt" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "/api/coding_challenge-manage/create_coding_challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.info(data.message);
        return;
      }

      toast.success("Challenge Created Successfully");

      setFormData({
        title: "",
        description: "",
        difficulty: "Easy",
        category: "React",
        timeLimit: 1000,
        maxAttempt: 5,
        starterCode: "",
        hint: "",
      });
    } catch (error) {
      toast.error(String(error));
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl border min-w-0"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
        boxShadow: "var(--shadow)",
      }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 break-words">
        Create Coding Problem
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Title */}

        <div className="min-w-0">
          <label className="font-semibold mb-2 block">Title</label>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
            className="w-full min-w-0 rounded-xl border p-3 outline-none transition-colors focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        {/* Description */}

        <div className="min-w-0">
          <label className="font-semibold mb-2 block">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full min-w-0 rounded-xl border p-3 outline-none transition-colors focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 resize-y"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        {/* Row */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <label className="font-medium">Difficulty</label>

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full min-w-0 rounded-xl border p-3 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
              style={{
                background: "var(--bg)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2 min-w-0">
            <label className="font-medium">Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full min-w-0 rounded-xl border p-3 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
              style={{
                background: "var(--bg)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            >
              <option value="React">JavaScript</option>
              <option value="Node.js">TypeScript</option>
              <option value="Algorithm">Python</option>
              <option value="Database">Java</option>
              <option value="React">C++</option>
              <option value="Node.js">Go</option>
              <option value="Algorithm">SQL</option>
              <option value="Database">MongoDB</option>
              <option value="Algorithm">Node.js</option>
              <option value="Database">Data Structures & Algorithms</option>
            </select>
          </div>
        </div>

        {/* Time */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <label className="font-medium">Time Limit (ms)</label>

            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              className="w-full min-w-0 rounded-xl border p-3 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
              style={{
                background: "var(--bg)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div className="space-y-2 min-w-0">
            <label className="font-medium">Max Attempt</label>

            <input
              type="number"
              name="maxAttempt"
              value={formData.maxAttempt}
              onChange={handleChange}
              className="w-full min-w-0 rounded-xl border p-3 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
              style={{
                background: "var(--bg)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        </div>

        {/* Starter */}

        <div className="space-y-2 min-w-0">
          <label className="font-medium">Starter Code</label>

          <textarea
            rows={10}
            name="starterCode"
            value={formData.starterCode}
            onChange={handleChange}
            placeholder="// Write starter code..."
            className="w-full min-w-0 rounded-xl border p-3 font-mono text-sm sm:text-base outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 resize-y"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              borderColor: "var(--border)",
              overflowWrap: "anywhere",
            }}
          />
        </div>

        {/* Hint */}

        <div className="space-y-2 min-w-0">
          <label className="font-medium">Hint</label>

          <textarea
            rows={4}
            name="hint"
            value={formData.hint}
            onChange={handleChange}
            placeholder="Helpful hint..."
            className="w-full min-w-0 rounded-xl border p-3 outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 resize-y"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3 sm:py-4 px-4 text-base sm:text-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "var(--primary)",
            color: "#FFFFFF",
          }}
        >
          {loading ? "Creating Challenge..." : "Create Challenge"}
        </button>
      </form>
    </div>
  );
}