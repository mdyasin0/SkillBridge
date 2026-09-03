"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeveloperHomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkDeveloperProfile = async () => {
      try {
        const response = await fetch("/api/developer_profile/check", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.replace("/pages/auth-required");
          return;
        }

        if (data.profileCompleted === false) {
          router.replace("/pages/developer/create-profile");
          return;
        }

        router.replace("/pages/developer/main_profile");
      } catch (error) {
        console.error("Profile check error:", error);
      }
    };

    checkDeveloperProfile();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Checking your profile...</p>
    </div>
  );
}