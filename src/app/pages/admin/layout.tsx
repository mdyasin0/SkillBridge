
"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowRight, X } from "lucide-react";

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

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent background scrolling while mobile sidebar is open
  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    // Session/user information is loading now
    if (loading) return;

    // if User is not login
    if (!isLoggedIn) {
      router.replace("/pages/auth-required");
      return;
    }

    // User banned
    if (user?.status === "banned") {
      toast.info("Your account has been banned. You have been logged out.");
      signOut({ callbackUrl: "/auth/login" });
      return;
    }

    // User suspended
    if (user?.status === "suspended") {
      toast.info("Your account has been suspended. You have been logged out.");
      signOut({ callbackUrl: "/auth/login" });
      return;
    }

    // User login, but he is not admin
    if (user?.role !== "admin") {
      router.replace("/pages/unauthorized");
      return;
    }
  }, [loading, isLoggedIn, user, router]);

  // Authentication / Authorization checking
  // Protected content will not be shown to unauthorized/inactive users
  if (
    loading ||
    !isLoggedIn ||
    user?.status === "banned" ||
    user?.status === "suspended" ||
    user?.role !== "admin"
  ) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div
            className="h-10 w-10 animate-spin rounded-full border-4"
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
              className="mt-1 text-sm"
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
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
        className={`
          fixed inset-0 z-40 md:hidden
          transition-opacity duration-300
          ${
            sidebarOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        style={{
          background: "var(--text)",
          opacity: sidebarOpen ? 0.35 : 0,
        }}
      />

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        aria-hidden={
          typeof window !== "undefined" &&
          window.matchMedia("(max-width: 767px)").matches
            ? !sidebarOpen
            : undefined
        }
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-72 max-w-[85vw] shrink-0 flex-col
          border-r p-4
          transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }
          md:sticky md:top-0 md:z-auto
          md:h-screen md:w-64 md:max-w-none
          md:translate-x-0
        `}
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Sidebar header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--text)" }}
          >
            Admin Panel
          </h2>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-lg transition-colors md:hidden
            "
            style={{
              color: "var(--text)",
              background: "var(--surface-hover)",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {routes.map((route) => {
            const isActive =
              pathname === route.path ||
              pathname.startsWith(route.path + "/");

            return (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className="
                  flex items-center rounded-lg px-4 py-3
                  font-medium transition-colors duration-200
                "
                style={{
                  background: isActive
                    ? "var(--primary)"
                    : "transparent",
                  color: isActive
                    ? "var(--bg-secondary)"
                    : "var(--text)",
                }}
                onMouseEnter={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background =
                      "var(--surface-hover)";
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background = "transparent";
                  }
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
        className="min-w-0 flex-1 p-4 sm:p-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        {children}
      </main>

      {/* Fixed floating arrow - mobile only */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation menu"
        aria-controls="admin-sidebar"
        aria-expanded={sidebarOpen}
        className={`
          fixed left-0 top-1/2 z-[60]
          flex h-12 w-9 -translate-y-1/2
          items-center justify-center
          rounded-r-xl border border-l-0
          shadow-lg transition-all duration-300
          md:hidden
          ${
            sidebarOpen
              ? "pointer-events-none -translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }
        `}
        style={{
          background: "var(--surface)",
          color: "var(--text)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <ArrowRight size={21} />
      </button>
    </div>
  );
}
