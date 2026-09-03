"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const routes = [
  { name: "Home", path: "/" },
  { name: "Profile", path: "/pages/developer/create-profile" },
  { name: "Challenge", path: "/pages/developer/challenge_select" },
  { name: "Main_Profile", path: "/pages/developer/main_profile" },
  { name: "Inbox", path: "/pages/developer/inbox" },
];

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoggedIn, loading } = useAuth();

  const [profileChecking, setProfileChecking] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Not logged in
    if (!isLoggedIn) {
      router.replace("/pages/auth-required");
      return;
    }

    // Logged in but not developer
    if (user?.role !== "developer") {
      router.replace("/pages/unauthorized");
      return;
    }

    checkDeveloperProfile();
  }, [loading, isLoggedIn, user]);

  const checkDeveloperProfile = async () => {
    try {
      setProfileChecking(true);

      const response = await fetch("/api/developer_profile/check", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Profile check failed:", data.message);
        return;
      }

      setProfileCompleted(data.profileCompleted);

      /*
       * Profile complete না হলে
       * create-profile ছাড়া অন্য কোনো route access করতে পারবে না
       */
      if (
        data.profileCompleted === false &&
        pathname !== "/pages/developer/create-profile"
      ) {
        router.replace("/pages/developer/create-profile");
        return;
      }
    } catch (error) {
      console.error("Developer profile check error:", error);
    } finally {
      setProfileChecking(false);
    }
  };

  /*
   * Route change হলে আবার check করবে
   */
  useEffect(() => {
    if (
      loading ||
      profileChecking ||
      !isLoggedIn ||
      user?.role !== "developer"
    ) {
      return;
    }

    if (!profileCompleted && pathname !== "/pages/developer/create-profile") {
      router.replace("/pages/developer/create-profile");
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

  // Authentication / Profile check loading
  if (loading || profileChecking || !isLoggedIn || user?.role !== "developer") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
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

            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
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
        <h2 className="text-xl font-semibold mb-6">Developer Panel</h2>

        <nav className="flex flex-col gap-2">
          {routes.map((route) => {
            // Profile already completed হলে
            // Create Profile navigation দেখাবে না
            if (
              route.path === "/pages/developer/create-profile" &&
              profileCompleted
            ) {
              return null;
            }

            const isActive =
              pathname === route.path || pathname.startsWith(route.path + "/");

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
