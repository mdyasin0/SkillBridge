"use client";

import Image from "next/image";
import { Pencil, Trophy, Star, Award, Flame, CheckCircle2 } from "lucide-react";
import SkillAnalytics from "../all_profile_pages/SkillAnalytics/page";
import ProfileSectionThree from "../all_profile_pages/ProfileSectionThree/page";
import PerformanceOverview from "../all_profile_pages/PerformanceOvervie/page";
import ChallengeStatistics from "../all_profile_pages/ChallengeStatistics/page";
import ChallengeHistorySection from "../all_profile_pages/ChallengeHistorySection/page";
import Achievements from "../all_profile_pages/Achievements/page";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
interface DeveloperProfileResponse {
  success: boolean;
  data: {
    user_id: number;
    name: string;
    fullName: string;
    user_photo: string;
    developer_photo: string;
    bio: string;
  };
  ranking: {
    rank: number;
    averageScore: string;
  };
  badgeSystem: {
    totalBadgeNumber: number;
  };
}
export default function DeveloperProfilePage() {
  const [profile, setProfile] = useState<DeveloperProfileResponse | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const userId = user.id;
  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/developer_profile?userId=${userId}`,
        );

        const data = await res.json();

        setProfile(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [userId]);
  const developer = profile?.data;
  const ranking = profile?.ranking;
  const badge = profile?.badgeSystem;
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Cover */}
      <div className="relative h-96  w-full overflow-hidden bg-linear-to-r from-indigo-700 via-blue-600 to-cyan-500">
        <div className="absolute  inset-0 bg-black/20" />

        <div className=" mx-auto max-w-7xl px-6">
          <div className="translate-y-20 rounded-3xl border border-white/20 bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <Image
                  src={
                    developer?.developer_photo ||
                    developer?.user_photo ||
                    "/default-user.png"
                  }
                  alt={developer?.fullName || "Developer"}
                  width={130}
                  height={130}
                  className="rounded-full border-4 border-white shadow-lg"
                />

                <div>
                  <h1 className="text-3xl font-bold">
                    {developer?.fullName || developer?.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {badge?.totalBadgeNumber > 0 ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        <CheckCircle2 size={16} />
                        Verified Developer
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                        Not Verified
                      </span>
                    )}

                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                      Rank #{ranking?.rank}
                    </span>
                  </div>

                  <p className="mt-4 max-w-xl text-slate-600">
                    {developer?.bio}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-center gap-5">
                <div className="text-center">
                  <h2 className="text-sm text-slate-500">
                    Overall Skill Score
                  </h2>

                  <h1 className="mt-2 text-6xl font-extrabold text-indigo-600">
                    91
                  </h1>

                  <p className="font-medium text-slate-500">out of 100</p>
                </div>

                <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                  <Pencil size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* spacing */}
      <div className="h-28" />

      {/* Quick Stats */}
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Completed Challenges"
          value="54"
          icon={<Trophy className="text-yellow-500" />}
        />

        <StatCard
          title="Running Challenges"
          value="2"
          icon={<Flame className="text-orange-500" />}
        />

        <StatCard
          title="Average Score"
          value="91%"
          icon={<Star className="text-indigo-600" />}
        />

        <StatCard
          title="Success Rate"
          value="96%"
          icon={<CheckCircle2 className="text-green-600" />}
        />

        <StatCard
          title="Verified Badges"
          value="8"
          icon={<Award className="text-pink-500" />}
        />

        <StatCard
          title="Current Streak"
          value="17 Days"
          icon={<Flame className="text-red-500" />}
        />
      </div>
      {/* 1 */}
      <SkillAnalytics />
      {/* 2 */}
      <ProfileSectionThree />
      {/* 3 */}
      <PerformanceOverview />
      {/* 4 */}
      <ChallengeStatistics />
      {/* 5 */}
      <ChallengeHistorySection />
      {/* 6 */}
      <Achievements />
    </div>
  );
}

type CardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

function StatCard({ title, value, icon }: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-slate-100 p-3">{icon}</div>

        <div className="text-right">
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">{value}</h2>
        </div>
      </div>
    </div>
  );
}
