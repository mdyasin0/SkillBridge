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
interface DeveloperProfileResponse {
  success: boolean;
  completedChallenges: number;
  pendingChallenges: number;
  successRate: string;
  project_challenge_average_score: string;
  problem_solving_average_score: string;

  data: {
    user_id: number;
    developer_profile_id: number;

    name: string;
    fullName: string;
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
  const params = useParams<{ id: string }>();;

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
  }, [params]);
  const developer = profile?.data;
  const ranking = profile?.ranking;
  const badge = profile?.badgeSystem;
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="pb-10 bg-slate-100">
      {/* Cover */}
      <div
        className="relative h-90  w-full overflow-hidden "
        style={{
          background:
            "linear-gradient(135deg,var(--primary),var(--primary-hover))",
        }}
      >
        <div className="absolute  inset-0 bg-black/20" />

        <div className=" mx-auto max-w-7xl px-6">
          <div
            className="translate-y-20 rounded-3xl border p-8 backdrop-blur-sm"
            style={{
              background: "color-mix(in srgb,var(--surface) 94%,transparent)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
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
                  className="rounded-full border-4"
                  style={{
                    borderColor: "var(--surface)",
                    boxShadow: "var(--shadow)",
                  }}
                />

                <div>
                  <h1
                    className="text-4xl font-bold tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    {developer?.fullName || developer?.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {(profile?.badgeSystem?.totalBadgeNumber ?? 0) > 0 ? (
                      <span
                        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                        style={{
                          background: "#DCFCE7",
                          color: "#166534",
                        }}
                      >
                        <CheckCircle2 size={16} />
                        Verified skills {badge?.totalBadgeNumber}
                      </span>
                    ) : (
                      <span
                        className="rounded-full  px-3 py-1 text-sm font-medium "
                        style={{
                          background: "var(--surface-hover)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Not Verified
                      </span>
                    )}

                    <span
                      className="rounded-full  px-3 py-1 text-sm font-medium "
                      style={{
                        background:
                          "color-mix(in srgb,var(--primary) 12%,white)",
                        color: "var(--primary)",
                      }}
                    >
                      Rank #{ranking?.rank}
                    </span>
                  </div>

                  <p
                    className="mt-4 max-w-xl "
                    style={{ color: "var(--text-muted)" }}
                  >
                    {developer?.bio}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-center gap-5">
                <div className="text-center">
                  <h2 className="text-sm text-slate-500">
                    Overall Platform Performance Score
                  </h2>

                  <h1 className="mt-2 text-6xl font-extrabold text-indigo-600">
                    {overallSkillScore?.score ?? 0}
                  </h1>

                  <p className="font-medium text-slate-500">
                    {" "}
                    out of {overallSkillScore?.maxScore ?? 100}{" "}
                  </p>
                </div>

                <button
                  className="flex items-center var(--primary-hover) gap-2 rounded-xl px-5 py-3 font-semibold  transition "
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

      {/* ===================== */}

      {/* Quick Stats */}
      <div className="mx-auto pt-10 grid max-w-7xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-3">
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
      {/* ========================== */}

      <section
        className="rounded-3xl max-w-6xl mx-auto mt-10 border p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="mb-8 flex items-center justify-between border-b pb-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Experience & Background
            </h2>

            <p style={{ color: "var(--text-muted)" }}>
              Professional experience and education.
            </p>
          </div>

          <UserRound size={28} style={{ color: "var(--primary)" }} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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

      {/* ================== */}
      {/* =============================== */}

      <section
        className="rounded-3xl mt-10 max-w-6xl mx-auto border p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="mb-8 flex items-center justify-between border-b pb-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Skills & Technologies
            </h2>

            <p className="mt-1" style={{ color: "var(--text-muted)" }}>
              Technical expertise and programming skills.
            </p>
          </div>

          <Code2 size={28} style={{ color: "var(--primary)" }} />
        </div>

        <div className="space-y-7">
          <div>
            <h4 className="mb-3 font-semibold" style={{ color: "var(--text)" }}>
              Skills
            </h4>

            <div className="flex flex-wrap gap-3">
              {JSON.parse(developer?.skills || "[]").map((skill: string) => (
                <span
                  key={skill}
                  className="rounded-full px-4 py-2 text-sm font-medium"
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
            <h4 className="mb-2 font-semibold" style={{ color: "var(--text)" }}>
              Tech Stack
            </h4>

            <p style={{ color: "var(--text-muted)" }}>{developer?.techStack}</p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold" style={{ color: "var(--text)" }}>
              Languages
            </h4>

            <div className="flex flex-wrap gap-3">
              {JSON.parse(developer?.languages || "[]").map((lang: string) => (
                <span
                  key={lang}
                  className="rounded-full px-4 py-2 text-sm"
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

      {/* ========================= */}
      {/* =================== */}
      <section
        className="rounded-3xl mt-10  max-w-6xl mx-auto border p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          className="mb-8 flex items-center justify-between border-b pb-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Professional Links
            </h2>

            <p style={{ color: "var(--text-muted)" }}>
              Connect through professional platforms.
            </p>
          </div>

          <Globe size={28} style={{ color: "var(--primary)" }} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <a
            href={developer?.github}
            target="_blank"
            className="rounded-2xl border p-5 transition hover:-translate-y-1"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <BsGithub className="mb-4" />

            <h4>GitHub</h4>

            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              View repositories
            </p>
          </a>

          <a
            href={developer?.portfolio}
            target="_blank"
            className="rounded-2xl border p-5 transition hover:-translate-y-1"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <BriefcaseBusiness className="mb-4" />

            <h4>Portfolio</h4>

            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Visit portfolio
            </p>
          </a>

          <a
            href={developer?.linkedin}
            target="_blank"
            className="rounded-2xl border p-5 transition hover:-translate-y-1"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <LiaLinkedin className="mb-4" />

            <h4>LinkedIn</h4>

            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Professional profile
            </p>
          </a>
        </div>
      </section>
      {/* ========================= */}
      <div className="mx-auto mt-10 max-w-7xl space-y-8 px-6">
        {/* ================= VERIFIED BADGES ================= */}

        <section
          className="rounded-3xl  p-8 shadow-sm"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2
                className="text-2xl font-bold "
                style={{ color: "var(--text)" }}
              >
                Verified Badges ({verifiedBadges.length})
              </h2>

              <p className="mt-1" style={{ color: "var(--text-muted)" }}>
                Badges earned from verified assessments.
              </p>
            </div>

            <Award className="text-indigo-600" size={34} />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {verifiedBadges.length > 0 ? (
              verifiedBadges.map((badge) => (
                <div
                  key={`${badge.badgeName}-${badge.id}`}
                  className="rounded-2xl border  p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl "
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
                    />
                  </div>

                  <h3
                    className="mt-5 text-lg font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {badge.title || badge.badgeName}
                  </h3>

                  <p
                    className="mt-3 text-sm leading-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {badge.short_description ??
                      "Successfully verified by completing platform assessments."}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="col-span-full rounded-3xl border border-dashed py-14 text-center"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background:
                      "color-mix(in srgb,var(--primary) 10%,transparent)",
                    color: "var(--primary)",
                  }}
                >
                  <Award size={38} />
                </div>

                <h3
                  className="mt-6 text-xl font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  No Verified Badges Yet
                </h3>

                <p
                  className="mx-auto mt-3 max-w-md leading-7"
                  style={{ color: "var(--text-muted)" }}
                >
                  Complete more verified challenges and maintain strong
                  performance to unlock your first badge.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}

        <section
          className="rounded-3xl border p-8"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Header */}
          <div
            className="mb-8 flex items-center justify-between border-b pb-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Recent Activity
              </h2>

              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Your latest approved challenge activities.
              </p>
            </div>

            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "rgba(91,108,255,.12)",
              }}
            >
              <Activity size={24} style={{ color: "var(--primary)" }} />
            </div>
          </div>

          {/* Activity List */}

          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl border p-5 transition-all hover:bg-(--surface-hover)
hover:shadow-lg duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Icon */}

                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                    style={{
                      background: "rgba(34,197,94,.12)",
                    }}
                  >
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>

                  {/* Content */}

                  <div className="flex-1">
                    <h3
                      className="font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {item.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "rgba(91,108,255,.12)",
                          color: "var(--primary)",
                        }}
                      >
                        {item.type}
                      </span>

                      <span style={{ color: "var(--text-muted)" }}>•</span>

                      <span
                        className="text-sm"
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
                className="rounded-2xl border border-dashed py-16 text-center"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "rgba(91,108,255,.10)",
                  }}
                >
                  <Activity size={30} style={{ color: "var(--primary)" }} />
                </div>

                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  No Recent Activity
                </h3>

                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  Your approved submissions will appear here once they are
                  reviewed.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================= LATEST ADMIN FEEDBACK ================= */}

      <section
        className="mx-auto mt-10 max-w-6xl rounded-3xl border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* Header */}

        <div
          className="flex items-center justify-between border-b px-8 py-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Latest Admin Feedback
            </h2>

            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Feedback received from approved challenge reviews.
            </p>
          </div>
        </div>

        {/* Feedback Cards */}

        <div className="grid gap-6 p-8 md:grid-cols-2">
          {latestFeedbacks.length > 0 ? (
            latestFeedbacks.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border hover:bg-(--surface-hover)
hover:shadow-lg p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Top */}

                <div className="flex items-start justify-between gap-5">
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {item.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "rgba(91,108,255,.12)",
                          color: "var(--primary)",
                        }}
                      >
                        {item.type}
                      </span>

                      <span
                        className="text-sm"
                        style={{
                          color: "var(--text-muted)",
                        }}
                      >
                        {getTimeAgo(item.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* Score */}

                  <div
                    className=" flex items-center gap-2 rounded-2xl px-4 py-3 text-center"
                    style={{
                      background: "rgba(245,158,11,.12)",
                    }}
                  >
                    <p
                      className="text-xl font-bold"
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

                {/* Feedback */}

                <div
                  className="mt-6 rounded-2xl p-4"
                  style={{
                    background: "var(--surface-hover)",
                  }}
                >
                  <p
                    className="line-clamp-4 leading-7"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {item.feedback}
                  </p>
                </div>

                {/* Footer */}

                <div
                  className="mt-6 flex items-center justify-between border-t pt-4"
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
                    className="font-semibold"
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
              className="col-span-full rounded-2xl border border-dashed py-16 text-center"
              style={{
                borderColor: "var(--border)",
              }}
            >
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(91,108,255,.10)",
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
                className="mt-2"
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
      className="flex items-center gap-4 rounded-2xl border p-5"
      style={{
        borderColor: "var(--border)",
      }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{
          background: "color-mix(in srgb,var(--primary) 10%,transparent)",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {title}
        </p>

        <h3 className="font-semibold" style={{ color: "var(--text)" }}>
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
      className="group rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105"
          style={{
            background: "color-mix(in srgb,var(--primary) 10%,transparent)",
            color: "var(--primary)",
          }}
        >
          {icon}
        </div>

        <div className="text-right">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>

          <h2
            className="mt-2 text-4xl font-black tracking-tight"
            style={{ color: "var(--text)" }}
          >
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}
