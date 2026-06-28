"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  category: string;
}

export default function ChallengesPage() {
  const [data, setData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/all_challenge")
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Challenge List
      </h1>

      <div
        className="overflow-hidden rounded-xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <table className="w-full">

          <thead
            style={{
              background: "var(--surface-hover)",
            }}
          >
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Difficulty</th>
              <th className="text-left p-4">Category</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <td className="p-4">{item.title}</td>

                <td className="p-4">
                  {item.difficulty}
                </td>

                <td className="p-4">
                  {item.category}
                </td>

                <td className="p-4 text-center">

                  <Link
                    href={`/pages/admin/challenge_list/${item.id}`}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{
                      background: "var(--primary)",
                    }}
                  >
                    View Details
                  </Link>
 <Link
    href={`/pages/admin/code_editor/${item.id}`}
    className="px-4 py-2 rounded-lg text-white"
    style={{
      background: "var(--primary)",
    }}
  >
    Complete Challenge
  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}