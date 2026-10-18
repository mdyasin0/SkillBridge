
"use client";

import Image from "next/image";
import {
  Pencil,
  Trophy,
  CheckCircle2,
  LoaderCircle,
  FolderKanban,
  Brain,
  Target,
  BadgeCheck,
  Star,
  Award,
  Activity,
  Briefcase,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Globe,
  Code2,
  UserRound,
} from "lucide-react";

import { useEffect, useState } from "react";

import { BsGithub } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";
import { useParams } from "next/navigation";
import ContactDeveloperButton from "../../contact_button/page";
import LoadingUI from "@/components/Loadinui";
import { toast } from "react-toastify";

interface DeveloperProfileResponse {
  success: boolean;
  completedChallenges: number;
  pendingChallenges: number;
  successRate: string;
  project_challenge_average_score: string;
  problem_solving_average_score: string;

  data: {
    user_id: number | string;
    developer_profile_id: number;
    title: string;
    name: string;
    email: string;
    role: string;

    user_photo: string;
    developer_photo: string;

    user_status: string;

    bio: string;

    experienceYears: number;
    experienceMonths: number;

    country: string;
    education: string;

    skills: string;
    techStack: string;
    languages: string;

    github: string;
    portfolio: string;
    linkedin: string;

    user_created_at: string;
    developer_created_at: string;
    developer_updated_at: string;
  };

  ranking: {
    rank: number;
    totalDevelopers: number;
    approved: number;
    averageScore: string;
    hard: number;
    medium: number;
    easy: number;
  };

  badgeSystem: {
    totalBadgeNumber: number | null | undefined;

    projectBadges: Badge[];
    problemBadges: Badge[];
  };

  recentProjectChallenges: Challenge[];

  recentProblemSolving: Challenge[];

  overallSkillScore: {
    score: number;
    maxScore: number;

    breakdown: {
      average: number;
      difficulty: number;
      badge: number;
    };
  };
}

interface Badge {
  id: number | null;
  badgeName: string;
  title: string | null;
  icon: string | null;
  short_description: string | null;
  totalCompletedChallenges: number;
  averageScore: number;
  verified: boolean;
}

interface Challenge {
  title: string;
  score: number | string;
  feedback: string;
  updated_at: string;
}

export default function DeveloperProfilePage() {
  const params = useParams<{ id: string }>();

  const userId = params.id;
  const [profile, setProfile] = useState<DeveloperProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const overallSkillScore = profile?.overallSkillScore;

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);

    const seconds = Math.floor((now.getTime() - updated.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);

    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);

    if (months < 12) return `${months} months ago`;

    const years = Math.floor(months / 12);

    return `${years} years ago`;
  };

  const recentActivities = [
    ...(profile?.recentProjectChallenges ?? []).map((item) => ({
      ...item,
      type: "Project Challenge",
    })),

    ...(profile?.recentProblemSolving ?? []).map((item) => ({
      ...item,
      type: "Problem Solving",
    })),
  ].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const latestFeedbacks = [
    ...(profile?.recentProjectChallenges ?? []).map((item) => ({
      ...item,
      type: "Project Challenge",
    })),

    ...(profile?.recentProblemSolving ?? []).map((item) => ({
      ...item,
      type: "Problem Solving",
    })),
  ]
    .filter((item) => item.feedback)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

  const verifiedBadges = [
    ...(profile?.badgeSystem.projectBadges ?? []),
    ...(profile?.badgeSystem.problemBadges ?? []),
  ].filter((item) => item.verified);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const res = await fetch(
          `/api/developer_profile?userId=${userId}`,
        );

        const data = await res.json();

        setProfile(data);
      } catch (error) {
        toast.error(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [params]);

  const developer = profile?.data;
  const ranking = profile?.ranking;
  const badge = profile?.badgeSystem;

  if (loading) {
    return <LoadingUI />;
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-(--bg) pb-8 text-(--text) transition-colors duration-300 sm:pb-10">
      <ContactDeveloperButton developerId={developer?.user_id} />

      {/* Cover */}
      <div
        className="relative min-h-72 w-full overflow-hidden sm:min-h-80 lg:min-h-90"
        style={{
          background:
            "linear-gradient(135deg,var(--primary),var(--primary-hover))",
        }}
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-7xl px-3 sm:px-5 lg:px-6">
          <div
            className="relative translate-y-8 rounded-2xl border p-4 backdrop-blur-sm sm:translate-y-12 sm:rounded-3xl sm:p-6 lg:translate-y-20 lg:p-8"
            style={{
              background: "color-mix(in srgb,var(--surface) 94%,transparent)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              {/* Left */}
              <div className="flex min-w-0 flex-col items-center gap-5 sm:flex-row sm:items-start lg:items-center">
                <Image
                  src={
                    developer?.developer_photo ||
                    developer?.user_photo ||
                    "/default-user.png"
                  }
                  alt={developer?.name || "Developer"}
                  width={130}
                  height={130}
                  className="h-24 w-24 shrink-0 rounded-full border-4 object-cover sm:h-28 sm:w-28 lg:h-[130px] lg:w-[130px]"
                  style={{
                    borderColor: "var(--surface)",
                    boxShadow: "var(--shadow)",
                  }}
                />

                <div className="min-w-0 w-full text-center sm:text-left">
                  <h1
                    className="break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
                    style={{ color: "var(--text)" }}
                  >
                    {developer?.name}
                  </h1>

                  <p className="mt-1 break-words text-base font-bold text-(--text-muted) sm:text-lg">
                    {developer?.title}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    {(profile?.badgeSystem?.totalBadgeNumber ?? 0) > 0 ? (
                      <span
                        className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold sm:text-sm"
                        style={{
                          background: "var(--surface-hover)",
                          borderColor: "var(--border)",
                          color: "var(--primary)",
                        }}
                      >
                        <CheckCircle2 size={16} className="shrink-0" />
                        Verified skills {badge?.totalBadgeNumber}
                      </span>
                    ) : (
                      <span
                        className="rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm"
                        style={{
                          background: "var(--surface-hover)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Not Verified
                      </span>
                    )}

                    <span
                      className="rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm"
                      style={{
                        background:
                          "color-mix(in srgb,var(--primary) 12%,var(--surface))",
                        color: "var(--primary)",
                      }}
                    >
                      Rank #{ranking?.rank}
                    </span>
                  </div>

                  <p
                    className="mx-auto mt-4 max-w-xl break-words text-sm leading-7 sm:mx-0 sm:text-base"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {developer?.bio}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex w-full shrink-0 flex-col items-center gap-5 border-t pt-6 lg:w-auto lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div className="w-full text-center">
                  <h2 className="text-sm leading-6 text-(--text-muted)">
                    Overall Platform Performance Score
                  </h2>

                  <h2
                    className="mt-2 break-words text-5xl font-extrabold sm:text-6xl"
                    style={{ color: "var(--primary)" }}
                  >
                    {overallSkillScore?.score ?? 0}
                  </h2>

                  <p className="font-medium text-(--text-muted)">
                    out of {overallSkillScore?.maxScore ?? 100}
                  </p>
                </div>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition hover:opacity-90 active:scale-[0.98] sm:w-auto"
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                  }}
                >
                  <Pencil size={18} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-3 pt-16 sm:grid-cols-2 sm:gap-5 sm:px-5 md:pt-20 xl:grid-cols-3 lg:px-6">
        <StatCard
          title="Completed Challenges"
          value={String(profile?.completedChallenges ?? 0)}
          icon={<Trophy />}
        />

        <StatCard
          title="Running Challenges"
          value={String(profile?.pendingChallenges ?? 0)}
          icon={<LoaderCircle />}
        />

        <StatCard
          title="Project Avg. Score"
          value={`${profile?.project_challenge_average_score ?? "0"} / 100`}
          icon={<FolderKanban />}
        />

        <StatCard
          title="Problem Solving Avg."
          value={`${profile?.problem_solving_average_score ?? "0"} / 100`}
          icon={<Brain />}
        />

        <StatCard
          title="Success Rate"
          value={`${profile?.successRate ?? "0"}%`}
          icon={<Target />}
        />

        <StatCard
          title="Verified Badges"
          value={String(profile?.badgeSystem?.totalBadgeNumber ?? 0)}
          icon={<BadgeCheck />}
        />
      </div>

      {/* Experience & Background */}
      <section
        className="mx-3 mt-8 rounded-2xl border p-4 sm:mx-5 sm:mt-10 sm:rounded-3xl sm:p-6 lg:mx-auto lg:max-w-6xl lg:p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="mb-6 flex items-start justify-between gap-3 border-b pb-5 sm:mb-8 sm:items-center sm:pb-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text)" }}
            >
              Experience & Background
            </h2>

            <p className="mt-1 text-sm leading-6 sm:text-base" style={{ color: "var(--text-muted)" }}>
              Professional experience and education.
            </p>
          </div>

          <UserRound
            size={26}
            className="shrink-0 sm:h-7 sm:w-7"
            style={{ color: "var(--primary)" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <InfoCard
            icon={<Briefcase />}
            title="Experience"
            value={`${developer?.experienceYears} Years ${developer?.experienceMonths} Months`}
          />

          <InfoCard
            icon={<MapPin />}
            title="Country"
            value={developer?.country ?? "Not provided"}
          />

          <InfoCard
            icon={<GraduationCap />}
            title="Education"
            value={developer?.education ?? "Not provided"}
          />

          <InfoCard
            icon={<Award />}
            title="Role"
            value={developer?.role ?? "Developer"}
          />
        </div>
      </section>

      {/* Skills & Technologies */}
      <section
        className="mx-3 mt-8 rounded-2xl border p-4 sm:mx-5 sm:mt-10 sm:rounded-3xl sm:p-6 lg:mx-auto lg:max-w-6xl lg:p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="mb-6 flex items-start justify-between gap-3 border-b pb-5 sm:mb-8 sm:items-center sm:pb-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text)" }}
            >
              Skills & Technologies
            </h2>

            <p className="mt-1 text-sm leading-6 sm:text-base" style={{ color: "var(--text-muted)" }}>
              Technical expertise and programming skills.
            </p>
          </div>

          <Code2
            size={26}
            className="shrink-0 sm:h-7 sm:w-7"
            style={{ color: "var(--primary)" }}
          />
        </div>

        <div className="space-y-6 sm:space-y-7">
          <div>
            <h4
              className="mb-3 font-semibold"
              style={{ color: "var(--text)" }}
            >
              Skills
            </h4>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {JSON.parse(developer?.skills || "[]").map((skill: string) => (
                <span
                  key={skill}
                  className="max-w-full break-words rounded-full px-3 py-2 text-sm font-medium sm:px-4"
                  style={{
                    background:
                      "color-mix(in srgb,var(--primary) 10%,transparent)",
                    color: "var(--primary)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="mb-2 font-semibold"
              style={{ color: "var(--text)" }}
            >
              Tech Stack
            </h4>

            <p
              className="break-words text-sm leading-7 sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              {developer?.techStack}
            </p>
          </div>

          <div>
            <h4
              className="mb-3 font-semibold"
              style={{ color: "var(--text)" }}
            >
              Languages
            </h4>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {JSON.parse(developer?.languages || "[]").map((lang: string) => (
                <span
                  key={lang}
                  className="max-w-full break-words rounded-full px-3 py-2 text-sm sm:px-4"
                  style={{
                    background: "var(--surface-hover)",
                    color: "var(--text)",
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Links */}
      <section
        className="mx-3 mt-8 rounded-2xl border p-4 sm:mx-5 sm:mt-10 sm:rounded-3xl sm:p-6 lg:mx-auto lg:max-w-6xl lg:p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="mb-6 flex items-start justify-between gap-3 border-b pb-5 sm:mb-8 sm:items-center sm:pb-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text)" }}
            >
              Professional Links
            </h2>

            <p className="mt-1 text-sm leading-6 sm:text-base" style={{ color: "var(--text-muted)" }}>
              Connect through professional platforms.
            </p>
          </div>

          <Globe
            size={26}
            className="shrink-0 sm:h-7 sm:w-7"
            style={{ color: "var(--primary)" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          <a
            href={developer?.github}
            target="_blank"
            className="min-w-0 rounded-2xl border p-4 transition hover:-translate-y-1 hover:bg-(--surface-hover) sm:p-5"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <BsGithub className="mb-4" size={22} />

            <h4 className="font-semibold">GitHub</h4>

            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              View repositories
            </p>
          </a>

          <a
            href={developer?.portfolio}
            target="_blank"
            className="min-w-0 rounded-2xl border p-4 transition hover:-translate-y-1 hover:bg-(--surface-hover) sm:p-5"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <BriefcaseBusiness className="mb-4" size={22} />

            <h4 className="font-semibold">Portfolio</h4>

            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Visit portfolio
            </p>
          </a>

          <a
            href={developer?.linkedin}
            target="_blank"
            className="min-w-0 rounded-2xl border p-4 transition hover:-translate-y-1 hover:bg-(--surface-hover) sm:p-5"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <LiaLinkedin className="mb-4" size={22} />

            <h4 className="font-semibold">LinkedIn</h4>

            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Professional profile
            </p>
          </a>
        </div>
      </section>

      {/* Verified Badges & Recent Activity */}
      <div className="mx-3 mt-8 max-w-7xl space-y-6 sm:mx-5 sm:mt-10 sm:space-y-8 lg:mx-auto lg:px-6">
        {/* Verified Badges */}
        <section
          className="rounded-2xl border p-4 sm:rounded-3xl sm:p-6 lg:p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="mb-6 flex items-start justify-between gap-3 sm:mb-8 sm:items-center">
            <div className="min-w-0">
              <h2
                className="break-words text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text)" }}
              >
                Verified Badges ({verifiedBadges.length})
              </h2>

              <p className="mt-1 text-sm leading-6 sm:text-base" style={{ color: "var(--text-muted)" }}>
                Badges earned from verified assessments.
              </p>
            </div>

            <Award
              className="shrink-0"
              style={{ color: "var(--primary)" }}
              size={30}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-5">
            {verifiedBadges.length > 0 ? (
              verifiedBadges.map((badge) => (
                <div
                  key={`${badge.badgeName}-${badge.id}`}
                  className="min-w-0 rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "color-mix(in srgb,var(--primary) 10%,transparent)",
                    }}
                  >
                    <Image
                      src={badge.icon || "/default-badge.png"}
                      alt={badge.title || badge.badgeName}
                      width={40}
                      height={40}
                      className="max-h-10 max-w-10 object-contain"
                    />
                  </div>

                  <h3
                    className="mt-4 break-words text-lg font-semibold sm:mt-5"
                    style={{ color: "var(--text)" }}
                  >
                    {badge.title || badge.badgeName}
                  </h3>

                  <p
                    className="mt-3 break-words text-sm leading-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {badge.short_description ??
                      "Successfully verified by completing platform assessments."}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="col-span-full rounded-2xl border border-dashed px-4 py-10 text-center sm:rounded-3xl sm:py-14"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20"
                  style={{
                    background:
                      "color-mix(in srgb,var(--primary) 10%,transparent)",
                    color: "var(--primary)",
                  }}
                >
                  <Award size={34} />
                </div>

                <h3
                  className="mt-5 text-lg font-semibold sm:mt-6 sm:text-xl"
                  style={{ color: "var(--text)" }}
                >
                  No Verified Badges Yet
                </h3>

                <p
                  className="mx-auto mt-3 max-w-md text-sm leading-7 sm:text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  Complete more verified challenges and maintain strong
                  performance to unlock your first badge.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section
          className="rounded-2xl border p-4 sm:rounded-3xl sm:p-6 lg:p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            className="mb-6 flex items-start justify-between gap-3 border-b pb-5 sm:mb-8 sm:items-center sm:pb-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="min-w-0">
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text)" }}
              >
                Recent Activity
              </h2>

              <p
                className="mt-1 text-sm leading-6"
                style={{ color: "var(--text-muted)" }}
              >
                Your latest approved challenge activities.
              </p>
            </div>

            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl"
              style={{
                background:
                  "color-mix(in srgb,var(--primary) 12%,transparent)",
              }}
            >
              <Activity size={24} style={{ color: "var(--primary)" }} />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((item, index) => (
                <div
                  key={index}
                  className="flex min-w-0 items-start gap-3 rounded-2xl border p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--surface-hover) hover:shadow-lg sm:gap-4 sm:p-5"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
                    style={{
                      background:
                        "color-mix(in srgb,var(--primary) 12%,transparent)",
                      color: "var(--primary)",
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="break-words font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {item.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className="max-w-full break-words rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background:
                            "color-mix(in srgb,var(--primary) 12%,transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        {item.type}
                      </span>

                      <span style={{ color: "var(--text-muted)" }}>•</span>

                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {getTimeAgo(item.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="rounded-2xl border border-dashed px-4 py-10 text-center sm:py-16"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
                  style={{
                    background:
                      "color-mix(in srgb,var(--primary) 10%,transparent)",
                  }}
                >
                  <Activity
                    size={30}
                    style={{ color: "var(--primary)" }}
                  />
                </div>

                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  No Recent Activity
                </h3>

                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  Your approved submissions will appear here once they are
                  reviewed.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Latest Admin Feedback */}
      <section
        className="mx-3 mt-8 rounded-2xl border sm:mx-5 sm:mt-10 sm:rounded-3xl lg:mx-auto lg:max-w-6xl"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="flex items-start justify-between gap-3 border-b px-4 py-5 sm:items-center sm:px-6 sm:py-6 lg:px-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text)" }}
            >
              Latest Admin Feedback
            </h2>

            <p
              className="mt-1 text-sm leading-6"
              style={{ color: "var(--text-muted)" }}
            >
              Feedback received from approved challenge reviews.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-2 lg:p-8">
          {latestFeedbacks.length > 0 ? (
            latestFeedbacks.map((item, index) => (
              <div
                key={index}
                className="min-w-0 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--surface-hover) hover:shadow-lg sm:p-6"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-5">
                  <div className="min-w-0 flex-1">
                    <h3
                      className="break-words text-base font-semibold sm:text-lg"
                      style={{ color: "var(--text)" }}
                    >
                      {item.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className="max-w-full break-words rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background:
                            "color-mix(in srgb,var(--primary) 12%,transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        {item.type}
                      </span>

                      <span
                        className="text-xs sm:text-sm"
                        style={{
                          color: "var(--text-muted)",
                        }}
                      >
                        {getTimeAgo(item.updated_at)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3"
                    style={{
                      background:
                        "color-mix(in srgb,var(--primary) 10%,transparent)",
                    }}
                  >
                    <p
                      className="text-lg font-bold sm:text-xl"
                      style={{
                        color: "var(--text)",
                      }}
                    >
                      {Number(item.score).toFixed(0)}
                    </p>

                    <span
                      className="text-xs"
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      Score
                    </span>
                  </div>
                </div>

                <div
                  className="mt-5 rounded-xl p-3 sm:mt-6 sm:rounded-2xl sm:p-4"
                  style={{
                    background: "var(--surface-hover)",
                  }}
                >
                  <p
                    className="line-clamp-4 break-words text-sm leading-7 sm:text-base"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {item.feedback}
                  </p>
                </div>

                <div
                  className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-4 sm:mt-6"
                  style={{
                    borderColor: "var(--border)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    Reviewed By
                  </span>

                  <span
                    className="text-sm font-semibold sm:text-base"
                    style={{
                      color: "var(--primary)",
                    }}
                  >
                    Platform Admin
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              className="col-span-full rounded-2xl border border-dashed px-4 py-10 text-center sm:py-16"
              style={{
                borderColor: "var(--border)",
              }}
            >
              <div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
                style={{
                  background:
                    "color-mix(in srgb,var(--primary) 10%,transparent)",
                }}
              >
                <Star
                  size={28}
                  style={{
                    color: "var(--primary)",
                  }}
                />
              </div>

              <h3
                className="text-lg font-semibold"
                style={{
                  color: "var(--text)",
                }}
              >
                No Feedback Yet
              </h3>

              <p
                className="mt-2 text-sm leading-6"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Feedback from reviewers will appear here after your submissions
                are evaluated.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div
      className="flex min-w-0 items-start gap-3 rounded-2xl border p-4 sm:items-center sm:gap-4 sm:p-5"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12"
        style={{
          background: "color-mix(in srgb,var(--primary) 10%,transparent)",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {title}
        </p>

        <h3
          className="mt-1 break-words text-sm font-semibold sm:text-base"
          style={{ color: "var(--text)" }}
        >
          {value}
        </h3>
      </div>
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
    <div
      className="group min-w-0 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-6"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl"
          style={{
            background: "color-mix(in srgb,var(--primary) 10%,transparent)",
            color: "var(--primary)",
          }}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p
            className="break-words text-xs font-medium sm:text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>

          <h2
            className="mt-2 break-words text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: "var(--text)" }}
          >
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}
