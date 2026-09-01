"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  BadgeCheck,
  Bell,
  CheckCircle2,
  ChevronRight,
  Code2,
  Filter,
  Layers3,
  MessageSquare,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserCheck,
  Users,
  Zap,
  Clock3,
  BriefcaseBusiness,
  FileCheck2,
  TerminalSquare,
  TrendingUp,
  CircleCheck,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const features = [
  {
    icon: Code2,
    title: "Coding Challenges",
    description:
      "Real coding problems with difficulty, technology, time limit, attempts and scoring workflows.",
  },
  {
    icon: Layers3,
    title: "Project Assessments",
    description:
      "Evaluate developers through practical project-based challenges instead of relying only on resumes.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Track scores, completed challenges, running tasks, challenge averages and overall skill performance.",
  },
  {
    icon: Trophy,
    title: "Ranking System",
    description:
      "Developer ranking is calculated from approved work, average score and challenge difficulty.",
  },
  {
    icon: Award,
    title: "Badge System",
    description:
      "Earn project and problem-solving badges that become part of your verified technical profile.",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description:
      "Recruiters and developers can connect directly through a database-backed messaging system.",
  },
];

const developerBenefits = [
  "Prove your skills through real challenges",
  "Build a verified technical profile",
  "Earn badges and improve your ranking",
  "Track your performance over time",
  "Receive reviewer feedback",
  "Connect directly with recruiters",
];

const recruiterBenefits = [
  "Discover developers beyond their resume",
  "Search by name, title and skills",
  "Filter by technology, country and experience",
  "Evaluate score, rank and challenge history",
  "View verified developer profiles",
  "Contact promising developers directly",
];

const challengeTypes = [
  {
    icon: TerminalSquare,
    label: "Problem Solving",
    description: "Test logic, algorithms and coding ability.",
  },
  {
    icon: Code2,
    label: "Coding Challenge",
    description: "Solve technology-focused coding problems.",
  },
  {
    icon: Layers3,
    label: "Project Challenge",
    description: "Demonstrate practical development skills.",
  },
];

const workflow = [
  {
    number: "01",
    icon: UserCheck,
    title: "Create your profile",
    text: "Developers build their professional profile while recruiters create their hiring identity.",
  },
  {
    number: "02",
    icon: Target,
    title: "Take real challenges",
    text: "Complete coding, problem-solving and project-based assessments under defined rules.",
  },
  {
    number: "03",
    icon: FileCheck2,
    title: "Get reviewed",
    text: "Submitted project and problem-solving work can be reviewed, scored and accompanied by feedback.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Build your proof",
    text: "Scores, badges, completed challenges and performance contribute to your technical profile.",
  },
  {
    number: "05",
    icon: Search,
    title: "Get discovered",
    text: "Recruiters can find and evaluate developers using actual performance data.",
  },
];

const stats = [
  {
    value: "Real",
    label: "Skill Evidence",
    icon: ShieldCheck,
  },
  {
    value: "3",
    label: "Challenge Types",
    icon: Layers3,
  },
  {
    value: "Role",
    label: "Based Experience",
    icon: Users,
  },
  {
    value: "Live",
    label: "Performance Tracking",
    icon: BarChart3,
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  center?: boolean;
}) {
  return (
    <div
      className={`max-w-3xl ${center ? "mx-auto text-center" : "text-left"}`}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-1.5 text-xs font-semibold text-(--primary) shadow-sm">
        <Sparkles size={14} />
        {eyebrow}
      </div>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-7 text-(--text-muted) sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  const { user, isLoggedIn } = useAuth();

  const role = user?.role;

  const primaryHref = !isLoggedIn
    ? "/auth/register"
    : role === "developer"
      ? "/pages/developer"
      : role === "recruiter"
        ? "/pages/recruiter"
        : role === "admin"
          ? "/pages/admin"
          : "/";

  const primaryLabel = !isLoggedIn
    ? "Build Your Profile"
    : role === "developer"
      ? "Open Developer Dashboard"
      : role === "recruiter"
        ? "Find Developers"
        : role === "admin"
          ? "Open Admin Dashboard"
          : "Explore SkillBridge";

  const secondaryHref =
    role === "recruiter"
      ? "/pages/recruiter/developer-finding"
      : role === "developer"
        ? "/pages/developer/challenges"
        : "/docs";

  const secondaryLabel =
    role === "recruiter"
      ? "Explore Developers"
      : role === "developer"
        ? "Explore Challenges"
        : "Explore How It Works";

  return (
    <main className="min-h-screen overflow-hidden bg-(--bg) text-(--text)">
    

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-20 h-64 w-64 rounded-full bg-(--primary)/10 blur-3xl" />
          <div className="absolute right-[8%] top-32 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-(--primary)/5 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28">
          {/* Hero copy */}
          <div>
            <div className="inline-flex animate-[fadeIn_.6s_ease-out] items-center gap-2 rounded-full border border-(--border) bg-(--surface)/80 px-4 py-2 text-sm font-medium text-(--text-muted) shadow-sm backdrop-blur">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--primary)/10 text-(--primary)">
                <ShieldCheck size={14} />
              </span>
              A better way to prove technical ability
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-(--text) sm:text-5xl lg:text-6xl xl:text-7xl">
              Don&apos;t just show your
              <span className="block bg-linear-to-r from-(--primary) to-indigo-400 bg-clip-text text-transparent">
                skills. Prove them.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-(--text-muted) sm:text-lg">
              SkillBridge connects developers with opportunities through
              real-world coding challenges, project assessments, verified
              performance, rankings, badges and direct recruiter communication.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-(--primary)/20 transition hover:bg-(--primary-hover) hover:-translate-y-0.5"
              >
                {primaryLabel}
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--surface) px-6 py-3.5 text-sm font-semibold text-(--text) shadow-sm transition hover:bg-(--surface-hover)"
              >
                {secondaryLabel}
                <ChevronRight size={17} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-(--text-muted)">
              <div className="flex items-center gap-2">
                <CircleCheck size={16} className="text-(--primary)" />
                Performance based
              </div>

              <div className="flex items-center gap-2">
                <CircleCheck size={16} className="text-(--primary)" />
                Role-based platform
              </div>

              <div className="flex items-center gap-2">
                <CircleCheck size={16} className="text-(--primary)" />
                Built for real hiring
              </div>
            </div>
          </div>

          {/* Hero product preview */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-5 rounded-4xk bg-(--primary)/10 blur-2xl" />

            <div className="relative rounded-4xl border border-(--border) bg-(--surface)/95 p-3 shadow-[0_30px_80px_rgba(15,23,42,.12)] backdrop-blur">
              {/* Fake browser header */}
              <div className="flex items-center justify-between rounded-xl border border-(--border) bg-(--bg) px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
                </div>

                <div className="hidden items-center gap-2 rounded-lg border border-(--border) bg-(--surface) px-3 py-1.5 text-[10px] text-(--text-muted) sm:flex">
                  <ShieldCheck size={11} className="text-(--primary)" />
                  verified-profile / developer
                </div>

                <div className="h-5 w-5 rounded-full bg-(--surface-hover)" />
              </div>

              <div className="p-4 sm:p-6">
                {/* Profile header */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-(--primary) to-indigo-400 text-lg font-bold text-white shadow-lg shadow-(--primary)/20">
                      SB
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-(--text)">
                          Verified Developer
                        </h3>
                        <BadgeCheck
                          size={16}
                          className="fill-(--primary) text-white"
                        />
                      </div>
                      <p className="text-xs text-(--text-muted)">
                        Full Stack Developer
                      </p>
                    </div>
                  </div>

                  <div className="hidden rounded-xl border border-(--border) bg-(--bg) px-3 py-2 text-right sm:block">
                    <p className="text-[10px] text-(--text-muted)">RANK</p>
                    <p className="font-bold text-(--primary)">#24</p>
                  </div>
                </div>

                {/* Score */}
                <div className="mt-6 rounded-2xl border border-(--border) bg-(--bg) p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-(--text-muted)">
                        Overall Skill Score
                      </p>
                      <p className="mt-1 text-3xl font-extrabold text-(--text)">
                        91
                        <span className="text-base text-(--text-muted)">
                          /100
                        </span>
                      </p>
                    </div>

                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-(--primary)/15">
                      <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-(--primary) border-r-(--primary) rotate-[-25deg]" />
                      <Zap size={19} className="text-(--primary)" />
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-(--border)">
                    <div className="h-full w-[91%] rounded-full bg-(--primary)" />
                  </div>
                </div>

                {/* Mini metrics */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-(--border) bg-(--bg) p-3">
                    <p className="text-[10px] text-(--text-muted)">APPROVED</p>
                    <p className="mt-1 text-lg font-bold text-(--text)">38</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-3">
                    <p className="text-[10px] text-(--text-muted)">AVG SCORE</p>
                    <p className="mt-1 text-lg font-bold text-(--text)">88%</p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--bg) p-3">
                    <p className="text-[10px] text-(--text-muted)">BADGES</p>
                    <p className="mt-1 text-lg font-bold text-(--text)">12</p>
                  </div>
                </div>

                {/* Challenge activity */}
                <div className="mt-4 rounded-xl border border-(--border) bg-(--bg) p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-(--text)">
                      Recent Performance
                    </p>
                    <TrendingUp size={15} className="text-(--primary)" />
                  </div>

                  <div className="mt-4 flex h-20 items-end gap-2">
                    {[38, 52, 44, 65, 57, 75, 68, 86, 80, 91].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-(--primary)/15"
                          style={{ height: `${height}%` }}
                        >
                          <div
                            className="h-full rounded-t-md bg-(--primary)"
                            style={{
                              opacity: index > 6 ? 1 : 0.45,
                            }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -left-5 bottom-12 hidden rounded-2xl border border-(--border) bg-(--surface) p-3 shadow-xl sm:flex sm:items-center sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-(--text)">Badge Earned</p>
                <p className="text-[11px] text-(--text-muted)">
                  Advanced Problem Solver
                </p>
              </div>
            </div>

            {/* Floating verified card */}
            <div className="absolute -right-4 top-24 hidden rounded-2xl border border-(--border) bg-(--surface) p-3 shadow-xl sm:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 size={17} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-(--text)">Verified</p>
                  <p className="text-[10px] text-(--text-muted)">
                    Technical profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VALUE STRIP
      ========================================================= */}
      <section className="border-y border-(--border) bg-(--surface)">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-(--border) sm:grid-cols-4 sm:divide-y-0">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-5 py-6 sm:px-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
                  <Icon size={19} />
                </div>

                <div>
                  <p className="text-lg font-bold text-(--text)">
                    {stat.value}
                  </p>
                  <p className="text-xs text-(--text-muted)">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          PROBLEM / SOLUTION
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="THE PROBLEM"
          title="A resume tells your story. Your performance tells the truth."
          description="Hiring often starts with resumes, portfolios and certificates. SkillBridge adds something more valuable: evidence of what a developer can actually do."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {/* Traditional */}
          <div className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <FileCheck2 size={21} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  Traditional Hiring
                </p>
                <h3 className="mt-0.5 text-xl font-bold text-(--text)">
                  Limited evidence
                </h3>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {[
                "Resume claims can be difficult to verify",
                "Portfolio quality does not always reflect problem-solving ability",
                "Certificates show learning, not necessarily execution",
                "Technical evaluation can require multiple interview stages",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <p className="text-sm leading-6 text-(--text-muted)">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SkillBridge */}
          <div className="relative overflow-hidden rounded-3xl border border-(--primary)/20 bg-(--primary)/5 p-6 shadow-sm sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-(--primary)/10 blur-3xl" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--primary) text-white shadow-lg shadow-(--primary)/20">
                <ShieldCheck size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-(--primary)">
                  SkillBridge Approach
                </p>
                <h3 className="mt-0.5 text-xl font-bold text-(--text)">
                  Evidence-based hiring
                </h3>
              </div>
            </div>

            <div className="relative mt-7 space-y-4">
              {[
                "Real coding and project-based assessments",
                "Reviewer feedback and scored submissions",
                "Ranking and badges based on performance",
                "A technical profile that evolves with actual work",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-(--primary)"
                  />
                  <p className="text-sm leading-6 text-(--text)">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CHALLENGES
      ========================================================= */}
      <section className="border-y border-(--border) bg-(--surface)">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="PROVE YOUR SKILLS"
            title="Different challenges. One technical profile."
            description="SkillBridge evaluates developers through multiple forms of practical assessment so one score does not have to tell the whole story."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {challengeTypes.map((challenge, index) => {
              const Icon = challenge.icon;

              return (
                <div
                  key={challenge.label}
                  className="group relative overflow-hidden rounded-3xl border border-(--border) bg-(--bg) p-7 transition duration-300 hover:-translate-y-1 hover:border-(--primary)/30 hover:shadow-(--shadow)"
                >
                  <div className="absolute right-5 top-5 text-5xl font-black text-(--primary)/5">
                    0{index + 1}
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--primary)/10 text-(--primary) transition group-hover:bg-(--primary) group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-(--text)">
                    {challenge.label}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-(--text-muted)">
                    {challenge.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-(--primary)">
                    Challenge-based assessment
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          DEVELOPER VS RECRUITER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="BUILT FOR BOTH SIDES"
          title="One platform. Two powerful experiences."
          description="Developers prove what they can do. Recruiters discover who can actually do the work."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Developer */}
          <div className="rounded-4xl border border-(--border) bg-(--surface) p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--primary)/10 text-(--primary)">
                  <Code2 size={23} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-(--primary)">
                    For Developers
                  </p>
                  <h3 className="text-2xl font-bold text-(--text)">
                    Turn skills into proof.
                  </h3>
                </div>
              </div>

              <Trophy className="text-(--primary)/30" size={30} />
            </div>

            <div className="mt-8 space-y-4">
              {developerBenefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-(--primary)"
                  />
                  <span className="text-sm text-(--text-muted)">{benefit}</span>
                </div>
              ))}
            </div>

            <Link
              href={
                isLoggedIn && role === "developer"
                  ? "/pages/developer/challenges"
                  : "/auth/register"
              }
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-(--primary)"
            >
              Start proving your skills
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Recruiter */}
          <div className="rounded-4xl border border-(--border) bg-(--surface) p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <BriefcaseBusiness size={23} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    For Recruiters
                  </p>
                  <h3 className="text-2xl font-bold text-(--text)">
                    Hire with evidence.
                  </h3>
                </div>
              </div>

              <Search className="text-indigo-500/30" size={30} />
            </div>

            <div className="mt-8 space-y-4">
              {recruiterBenefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-(--primary)"
                  />
                  <span className="text-sm text-(--text-muted)">{benefit}</span>
                </div>
              ))}
            </div>

            <Link
              href={
                isLoggedIn && role === "recruiter"
                  ? "/pages/recruiter/developer-finding"
                  : "/auth/register"
              }
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-(--primary)"
            >
              Find your next developer
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          DEVELOPER PROFILE SHOWCASE
      ========================================================= */}
      <section className="overflow-hidden border-y border-(--border) bg-(--surface)">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-(--primary)/10 px-3 py-1.5 text-xs font-semibold text-(--primary)">
              <BadgeCheck size={14} />
              VERIFIED TECHNICAL PROFILE
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
              A profile that shows more than a job title.
            </h2>

            <p className="mt-5 text-base leading-7 text-(--text-muted)">
              SkillBridge brings together challenge performance, ranking,
              badges, scores, activity, feedback, skills and professional
              information into one developer profile.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Trophy,
                  title: "Performance-based ranking",
                  text: "Rank reflects actual challenge performance.",
                },
                {
                  icon: Award,
                  title: "Achievement system",
                  text: "Badges highlight demonstrated capabilities.",
                },
                {
                  icon: BarChart3,
                  title: "Skill analytics",
                  text: "Understand strengths through measurable data.",
                },
                {
                  icon: MessageSquare,
                  title: "Recruiter communication",
                  text: "Move from discovery to conversation directly.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--bg) text-(--primary)">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-(--text)">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile visualization */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-(--primary)/5 blur-3xl" />

            <div className="relative rounded-4xl border border-(--border) bg-(--bg) p-4 shadow-(--shadow) sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-(--primary) to-indigo-400 text-xl font-bold text-white">
                    JD
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-(--text)">
                        Jordan Developer
                      </h3>
                      <BadgeCheck
                        size={17}
                        className="fill-(--primary) text-white"
                      />
                    </div>

                    <p className="text-sm text-(--text-muted)">
                      Full Stack Engineer
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {["React", "Next.js", "Node.js"].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-(--border) bg-(--surface) px-2.5 py-1 text-[10px] font-medium text-(--text-muted)"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-[10px] uppercase tracking-wider text-(--text-muted)">
                    Rank
                  </p>
                  <p className="text-xl font-extrabold text-(--primary)">#18</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-(--text-muted)">Overall Skill</p>
                    <Zap size={16} className="text-(--primary)" />
                  </div>

                  <p className="mt-2 text-3xl font-black text-(--text)">92</p>

                  <div className="mt-3 h-1.5 rounded-full bg-(--border)">
                    <div className="h-full w-[92%] rounded-full bg-(--primary)" />
                  </div>
                </div>

                <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-(--text-muted)">Average Score</p>
                    <Star size={16} className="text-amber-500" />
                  </div>

                  <p className="mt-2 text-3xl font-black text-(--text)">89%</p>

                  <p className="mt-2 text-xs text-(--text-muted)">
                    Across reviewed submissions
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-(--border) bg-(--surface) p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-(--text)">
                    Challenge Performance
                  </p>
                  <span className="text-[10px] text-(--text-muted)">
                    Recent activity
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    ["Hard", "14"],
                    ["Medium", "21"],
                    ["Easy", "29"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-(--bg) p-3 text-center"
                    >
                      <p className="text-[10px] text-(--text-muted)">{label}</p>
                      <p className="mt-1 text-lg font-bold text-(--text)">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Problem Solver", "Project Pro", "Consistent"].map(
                  (badge) => (
                    <div
                      key={badge}
                      className="flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-2"
                    >
                      <Award size={14} className="text-amber-500" />
                      <span className="text-[11px] font-medium text-(--text)">
                        {badge}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RECRUITER DISCOVERY
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          {/* Search UI mockup */}
          <div className="order-2 lg:order-1">
            <div className="rounded-4xl border border-(--border) bg-(--surface) p-4 shadow-(--shadow) sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-(--border) bg-(--bg) px-4 py-3">
                  <Search size={18} className="text-(--text-muted)" />
                  <span className="text-sm text-(--text-muted)">
                    Search developers by name, title, skill...
                  </span>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-sm font-medium text-(--text)">
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["React", "Node.js", "5+ years", "Top Rank"].map((filter) => (
                  <span
                    key={filter}
                    className="rounded-full bg-(--primary)/10 px-3 py-1.5 text-xs font-medium text-(--primary)"
                  >
                    {filter}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    initials: "AS",
                    name: "Alex Smith",
                    title: "Senior Full Stack Developer",
                    score: "94",
                    rank: "#8",
                  },
                  {
                    initials: "MR",
                    name: "Maya Rahman",
                    title: "Frontend Engineer",
                    score: "91",
                    rank: "#14",
                  },
                  {
                    initials: "DK",
                    name: "Daniel Kim",
                    title: "Backend Engineer",
                    score: "89",
                    rank: "#22",
                  },
                ].map((developer) => (
                  <div
                    key={developer.name}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-(--border) bg-(--bg) p-4 transition hover:border-(--primary)/30"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-sm font-bold text-(--primary)">
                        {developer.initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-bold text-(--text)">
                            {developer.name}
                          </p>
                          <BadgeCheck
                            size={14}
                            className="shrink-0 fill-(--primary) text-white"
                          />
                        </div>

                        <p className="truncate text-xs text-(--text-muted)">
                          {developer.title}
                        </p>
                      </div>
                    </div>

                    <div className="hidden items-center gap-6 sm:flex">
                      <div className="text-right">
                        <p className="text-[10px] text-(--text-muted)">SCORE</p>
                        <p className="text-sm font-bold text-(--text)">
                          {developer.score}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-(--text-muted)">RANK</p>
                        <p className="text-sm font-bold text-(--primary)">
                          {developer.rank}
                        </p>
                      </div>

                      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--surface) text-(--text-muted)">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-(--primary)/10 px-3 py-1.5 text-xs font-semibold text-(--primary)">
              <Search size={14} />
              FOR RECRUITERS
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
              Find developers by evidence, not assumptions.
            </h2>

            <p className="mt-5 text-base leading-7 text-(--text-muted)">
              Recruiters can discover developers using searchable and filterable
              technical profiles. Compare performance, score, ranking,
              experience, badges and skills before starting a conversation.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Search", "Name, title and skills"],
                ["Filter", "Technology, country and experience"],
                ["Compare", "Score, rank and challenge data"],
                ["Connect", "Message developers directly"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-(--border) bg-(--surface) p-4"
                >
                  <p className="text-sm font-bold text-(--text)">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-(--text-muted)">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={
                isLoggedIn && role === "recruiter"
                  ? "/pages/recruiter/developer-finding"
                  : "/auth/register"
              }
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-(--primary)/20 transition hover:bg-(--primary-hover)"
            >
              Explore Developer Profiles
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          WORKFLOW
      ========================================================= */}
      <section className="border-y border-(--border) bg-(--surface)">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="HOW SKILLBRIDGE WORKS"
            title="From skill to opportunity."
            description="The platform creates a continuous loop where developers demonstrate ability and recruiters discover proven talent."
          />

          <div className="relative mt-16">
            <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-(--border) lg:block" />

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
              {workflow.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="relative text-center lg:text-left"
                  >
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-(--border) bg-(--surface) text-(--primary) shadow-sm lg:mx-0">
                      <Icon size={23} />
                    </div>

                    <p className="mt-5 text-xs font-bold tracking-widest text-(--primary)">
                      {item.number}
                    </p>

                    <h3 className="mt-2 text-base font-bold text-(--text)">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-(--text-muted)">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PLATFORM SYSTEMS
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="THE PLATFORM"
          title="More than a job portal."
          description="SkillBridge combines assessment, performance tracking, verification, discovery and communication into one production-oriented platform."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-(--border) bg-(--surface) p-6 transition duration-300 hover:-translate-y-1 hover:border-(--primary)/30 hover:shadow-(--shadow)"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary) transition group-hover:bg-(--primary) group-hover:text-white">
                  <Icon size={20} />
                </div>

                <h3 className="mt-5 text-base font-bold text-(--text)">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-(--text-muted)">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          MESSAGING
      ========================================================= */}
      <section className="border-y border-(--border) bg-(--surface)">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-(--primary)/10 px-3 py-1.5 text-xs font-semibold text-(--primary)">
              <MessageSquare size={14} />
              CONNECT DIRECTLY
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
              Discovery should lead to conversation.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-(--text-muted)">
              Once a recruiter finds a promising developer, SkillBridge makes it
              easy to move from profile discovery to direct communication.
              Conversations, read status, unread counts, message refresh and
              message editing are part of the experience.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Bell,
                  title: "Unread tracking",
                  text: "Know when a new message needs attention.",
                },
                {
                  icon: Clock3,
                  title: "Conversation context",
                  text: "See message timing and previous conversations.",
                },
                {
                  icon: MessageSquare,
                  title: "Direct replies",
                  text: "Continue conversations from the dashboard inbox.",
                },
                {
                  icon: CheckCircle2,
                  title: "Connected workflow",
                  text: "Profile → discovery → contact in one platform.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-(--border) bg-(--bg) p-4"
                  >
                    <Icon size={18} className="text-(--primary)" />
                    <p className="mt-3 text-sm font-bold text-(--text)">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-(--text-muted)">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat visualization */}
          <div className="rounded-4xl border border-(--border) bg-(--bg) p-4 shadow-(--shadow) sm:p-6">
            <div className="flex items-center gap-3 border-b border-(--border) pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--primary) text-sm font-bold text-white">
                JD
              </div>

              <div>
                <p className="text-sm font-bold text-(--text)">
                  Jordan Developer
                </p>
                <p className="text-xs text-(--text-muted)">
                  Verified Developer
                </p>
              </div>

              <div className="ml-auto flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-4 py-6">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-(--border) bg-(--surface) p-4">
                <p className="text-sm leading-6 text-(--text)">
                  Hi, I reviewed your developer profile and your recent project
                  performance looks interesting.
                </p>
                <p className="mt-2 text-[10px] text-(--text-muted)">10:42 AM</p>
              </div>

              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-(--primary) p-4 text-white">
                <p className="text-sm leading-6">
                  Thank you. I&apos;d be happy to discuss the opportunity.
                </p>
                <p className="mt-2 text-[10px] text-white/70">
                  10:44 AM · Read
                </p>
              </div>

              <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-(--border) bg-(--surface) p-4">
                <p className="text-sm leading-6 text-(--text)">
                  Great. Let&apos;s discuss the role and the project.
                </p>
                <p className="mt-2 text-[10px] text-(--text-muted)">10:45 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--surface) p-2">
              <div className="flex-1 px-2 text-sm text-(--text-muted)">
                Write a message...
              </div>

              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--primary) text-white">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ADMIN / PLATFORM QUALITY
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-4xl border border-(--border) bg-(--surface) p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-(--primary)/10 px-3 py-1.5 text-xs font-semibold text-(--primary)">
                <ShieldCheck size={14} />
                PRODUCTION-ORIENTED ARCHITECTURE
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--text)">
                Built as a software system, not just a UI project.
              </h2>

              <p className="mt-5 text-sm leading-7 text-(--text-muted)">
                SkillBridge brings authentication, role-based authorization,
                database workflows, challenge lifecycle management, submission
                review, ranking, badges, analytics and messaging into one
                application.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Authentication", "Login, registration and session-aware UI"],
                ["Authorization", "Developer, recruiter and admin experiences"],
                [
                  "Challenge Lifecycle",
                  "Available → Running → Submitted → Reviewed",
                ],
                [
                  "Submission Logic",
                  "Attempts, timers, resubmission and validation",
                ],
                ["Review Workflow", "Score, feedback and approval management"],
                ["Analytics", "Skill score, averages, ranking and activity"],
                [
                  "Discovery",
                  "Search, filtering, sorting and developer profiles",
                ],
                [
                  "Communication",
                  "Conversation, read status and message editing",
                ],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-(--border) bg-(--bg) p-4"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-(--primary)" />
                    <p className="text-sm font-bold text-(--text)">{title}</p>
                  </div>

                  <p className="mt-2 pl-6 text-xs leading-5 text-(--text-muted)">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-(--primary)" />

        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-900/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
            <Zap size={25} />
          </div>

          <h2 className="mt-7 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your next opportunity should see what you can actually do.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Whether you&apos;re proving your ability or looking for someone who
            can deliver, SkillBridge turns technical skill into meaningful
            evidence.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-(--primary) shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              {primaryLabel}
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <Play size={16} />
              Learn More
            </Link>
          </div>
        </div>
      </section>

      

      {/* Small local animation utilities */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
