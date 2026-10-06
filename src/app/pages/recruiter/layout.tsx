"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
       toast.error(data.message
        );
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

  // when Route change ,profile status  will check
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

    //  if Profile is incomplete just profile-setup is  accessible
    if (
      !profileCompleted &&
      pathname !== "/pages/recruiter/profile-setup"
    ) {
      router.replace("/pages/recruiter/profile-setup");
      return;
    }

    // if Profile is completed  profile-setup is not accessible more
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
            // if Profile  is incomplete just Profile Setup will show
            if (
              !profileCompleted &&
              route.path !== "/pages/recruiter/profile-setup"
            ) {
              return null;
            }

            // if Profile is complete  Profile Setup will hide 
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