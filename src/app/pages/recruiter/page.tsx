"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecruiterHomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkRecruiterProfile = async () => {
      try {
        const response = await fetch("/api/recruiter_profile/check", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.replace("/pages/auth-required");
          return;
        }

        if (data.profileCompleted === false) {
          router.replace("/pages/recruiter/profile-setup");
          return;
        }

        router.replace("/pages/recruiter/DeveloperSearch");
      } catch (error) {
        console.error("Recruiter profile check error:", error);
      }
    };

    checkRecruiterProfile();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Checking your profile...</p>
    </div>
  );
}