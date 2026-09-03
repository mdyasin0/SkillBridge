"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  // Authentication + Authorization + Profile check
  useEffect(() => {
    if (loading) return;

    // User login করা নেই
    if (!isLoggedIn) {
      router.replace("/pages/auth-required");
      return;
    }

    // User recruiter নয়
    if (user?.role !== "recruiter") {
      router.replace("/pages/unauthorized");
      return;
    }

    checkRecruiterProfile();
  }, [loading, isLoggedIn, user]);

  const checkRecruiterProfile = async () => {
    try {
      setProfileChecking(true);

      const response = await fetch("/api/recruiter_profile/check", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(
          "Recruiter profile check failed:",
          data.message
        );
        return;
      }

      const completed = data.profileCompleted;

      setProfileCompleted(completed);

      // Profile নেই
      if (
        !completed &&
        pathname !== "/pages/recruiter/profile-setup"
      ) {
        router.replace("/pages/recruiter/profile-setup");
        return;
      }

      // Profile already exists কিন্তু profile-setup page-এ যাওয়ার চেষ্টা করলে
      if (
        completed &&
        pathname === "/pages/recruiter/profile-setup"
      ) {
        router.replace("/pages/recruiter/DeveloperSearch");
        return;
      }
    } catch (error) {
      console.error("Recruiter profile check error:", error);
    } finally {
      setProfileChecking(false);
    }
  };

  // Route change হলে profile status check করবে
  useEffect(() => {
    if (
      loading ||
      profileChecking ||
      !isLoggedIn ||
      user?.role !== "recruiter"
    ) {
      return;
    }

    // Profile incomplete হলে শুধু profile-setup accessible
    if (
      !profileCompleted &&
      pathname !== "/pages/recruiter/profile-setup"
    ) {
      router.replace("/pages/recruiter/profile-setup");
      return;
    }

    // Profile complete হলে profile-setup আর accessible নয়
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
      {/* Sidebar */}
      <aside
        className="w-64 p-4 border-r"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-semibold mb-6">
          Recruiter Panel
        </h2>

        <nav className="flex flex-col gap-2">
          {routes.map((route) => {
            // Profile complete হলে Profile Setup navigation hide
            if (
              route.path === "/pages/recruiter/profile-setup" &&
              profileCompleted
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
                className="px-4 py-2 rounded-md transition-all"
                style={{
                  background: isActive
                    ? "var(--primary)"
                    : "transparent",
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