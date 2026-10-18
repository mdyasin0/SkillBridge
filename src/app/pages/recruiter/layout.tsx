
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
  { name: "Profile", path: "/pages/recruiter/profile" },
  { name: "Profile Setup", path: "/pages/recruiter/profile-setup" },
  { name: "Developer Search", path: "/pages/recruiter/DeveloperSearch" },
  { name: "Inbox", path: "/pages/recruiter/inbox" },
];

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoggedIn, loading } = useAuth();

  const [profileChecking, setProfileChecking] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

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

  // Authentication + Authorization + Profile check
  useEffect(() => {
    if (loading) return;

    // User is not login
    if (!isLoggedIn) {
      router.replace("/pages/auth-required");
      return;
    }

    // User banned
    if (user?.status === "banned") {
      toast.info(
        "Your account has been banned. You have been logged out."
      );

      signOut({
        callbackUrl: "/auth/login",
      });

      return;
    }

    // User suspended
    if (user?.status === "suspended") {
      toast.info(
        "Your account has been suspended. You have been logged out."
      );

      signOut({
        callbackUrl: "/auth/login",
      });

      return;
    }

    // User is not recruiter
    if (user?.role !== "recruiter") {
      router.replace("/pages/unauthorized");
      return;
    }

    checkRecruiterProfile();
  }, [loading, isLoggedIn, user]);

  const checkRecruiterProfile = async () => {
    try {
      setProfileChecking(true);

      const response = await fetch(
        "/api/recruiter_profile_info/check",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message);
        return;
      }

      const completed = data.profileCompleted;

      setProfileCompleted(completed);

      // no Profile
      if (
        !completed &&
        pathname !== "/pages/recruiter/profile-setup"
      ) {
        router.replace("/pages/recruiter/profile-setup");
        return;
      }

      // Profile already exists but try to redirect profile-setup page
      if (
        completed &&
        pathname === "/pages/recruiter/profile-setup"
      ) {
        router.replace("/pages/recruiter/DeveloperSearch");
        return;
      }
    } catch (error) {
      toast.error(String(error));
    } finally {
      setProfileChecking(false);
    }
  };

  // when Route change, profile status will check
  useEffect(() => {
    if (
      loading ||
      profileChecking ||
      !isLoggedIn ||
      user?.status === "banned" ||
      user?.status === "suspended" ||
      user?.role !== "recruiter"
    ) {
      return;
    }

    // if Profile is incomplete just profile-setup is accessible
    if (
      !profileCompleted &&
      pathname !== "/pages/recruiter/profile-setup"
    ) {
      router.replace("/pages/recruiter/profile-setup");
      return;
    }

    // if Profile is completed profile-setup is not accessible more
    if (
      profileCompleted &&
      pathname === "/pages/recruiter/profile-setup"
    ) {
      router.replace("/pages/recruiter/DeveloperSearch");
    }
  }, [
    pathname,
    loading,
    profileChecking,
    profileCompleted,
    isLoggedIn,
    user,
    router,
  ]);

  // Loading UI
  if (
    loading ||
    profileChecking ||
    !isLoggedIn ||
    user?.status === "banned" ||
    user?.status === "suspended" ||
    user?.role !== "recruiter"
  ) {
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
              style={{ color: "var(--text-muted)" }}
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
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        style={{
          background: "var(--text)",
          opacity: sidebarOpen ? 0.35 : 0,
        }}
      />

      {/* Sidebar */}
      <aside
        id="recruiter-sidebar"
        aria-label="Recruiter navigation"
        aria-hidden={
          typeof window !== "undefined" &&
          window.matchMedia("(max-width: 767px)").matches
            ? !sidebarOpen
            : undefined
        }
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-72 max-w-[85vw] flex-col
          border-r p-4
          transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:z-auto
          md:h-screen md:w-64 md:max-w-none
          md:shrink-0 md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
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
            Recruiter Panel
          </h2>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-lg transition-colors
              md:hidden
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
            // if Profile is incomplete just Profile Setup will show
            if (
              !profileCompleted &&
              route.path !== "/pages/recruiter/profile-setup"
            ) {
              return null;
            }

            // if Profile is complete Profile Setup will hide
            if (
              profileCompleted &&
              route.path === "/pages/recruiter/profile-setup"
            ) {
              return null;
            }

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
                    event.currentTarget.style.background =
                      "transparent";
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
        aria-controls="recruiter-sidebar"
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
