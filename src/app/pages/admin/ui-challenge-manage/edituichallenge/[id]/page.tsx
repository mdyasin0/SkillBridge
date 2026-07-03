"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Challenge = {
  title: string;
  description: string;
  technology: string;
  difficulty: string;
  category: string;
  timeLimit: number;
  maxAttempts: number;
  rewardBadge: string;
};

export default function EditChallengePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState<Challenge>({
    title: "",
    description: "",
    technology: "",
    difficulty: "",
    category: "",
    timeLimit: 0,
    maxAttempts: 0,
    rewardBadge: "",
  });

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`/api/ui_challenge_manage/uichallengedata/${id}`);
        const result = await res.json();

        setFormData(result.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load challenge.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const res = await fetch(`/api/ui_challenge_manage/updateuichallenge/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert(result.message);

      router.push("/pages/admin/ui-challenges");
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div
        className="rounded-2xl border p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1 className="text-3xl font-bold mb-8">
          Update UI Challenge
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block mb-2">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 resize-none"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2">
                Technology
              </label>

              <input
                type="text"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block mb-2">
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">
                  Medium
                </option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block mb-2">
                Time Limit
              </label>

              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block mb-2">
                Max Attempts
              </label>

              <input
                type="number"
                name="maxAttempts"
                value={formData.maxAttempts}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block mb-2">
                Reward Badge
              </label>

              <input
                type="text"
                name="rewardBadge"
                value={formData.rewardBadge}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="px-8 py-3 rounded-xl text-white disabled:opacity-50"
            style={{
              background: "var(--primary)",
            }}
          >
            {updating
              ? "Updating..."
              : "Update Challenge"}
          </button>
        </form>
      </div>
    </div>
  );
}