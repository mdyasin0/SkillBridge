
"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useEffect } from "react";

const routes = [
  { name: "Home", path: "/" },
  { name: "users-management", path: "/pages/admin/users_management" },
  {
    name: "Coding-Challenge-lists",
    path: "/pages/admin/coding-challenge-manage/coding_challenge_lists",
  },
  {
    name: "Create-Coding-Challenge",
    path: "/pages/admin/coding-challenge-manage/create_coding_challenge",
  },
  {
    name: "Create-ui-challenge",
    path: "/pages/admin/ui-challenge-manage/create_ui_challenge",
  },
  {
    name: "Ui-challenges-lists",
    path: "/pages/admin/ui-challenge-manage/ui-challenges-lists",
  },
  {
    name: "works-review",
    path: "/pages/admin/work_types_selection",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoggedIn, loading } = useAuth();

  useEffect(() => {
    // Session/user information এখনো load হচ্ছে
    if (loading) return;

    // User login করা নেই
    if (!isLoggedIn) {
      router.replace("/pages/auth-required");
      return;
    }

    // User login করেছে, কিন্তু admin নয়
    if (user?.role !== "admin") {
      router.replace("/pages/unauthorized");
    }
  }, [loading, isLoggedIn, user, router]);

  // Authentication / Authorization check চলাকালীন
  // অথবা unauthorized user-এর ক্ষেত্রে protected content দেখানো হবে না
  if (loading || !isLoggedIn || user?.role !== "admin") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin"
            style={{
              borderColor: "var(--border)",
              borderTopColor: "var(--primary)",
            }}
          />

          <div className="text-center">
            <p
              className="text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              Checking access...
            </p>

            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        className="w-64 p-4 border-r"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          {routes.map((route) => {
            const isActive =
              pathname === route.path ||
              pathname.startsWith(route.path + "/");

            return (
              <Link
                key={route.path}
                href={route.path}
                className="px-4 py-2 rounded-md transition-all"
                style={{
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "#fff" : "var(--text)",
                }}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Right Content */}
      <main
        className="flex-1 p-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        {children}
      </main>
    </div>
  );
}

