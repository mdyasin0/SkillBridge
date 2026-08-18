"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  ExternalLink,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

import Image from "next/image";
import { FaGithub } from "react-icons/fa";

type DeveloperApiData = {
  id: number;
  userId: number;
  photo: string | null;
  fullName: string;
  title: string | null;
  availability: number;
  bio: string | null;
  experienceYears: number | null;
  experienceMonths: number | null;
  country: string | null;

  skills: string | string[] | null;
  techStack: string | string[] | null;

  github: string | null;
  portfolio: string | null;
  rank: number | null;
  overallSkillScore: number | null;
  totalBadgeNumber: number | null;
};

type Developer = {
  id: number;
  name: string;
  avatar: string | null;
  country: string;
  title: string;
  bio: string;

  experienceYears: number;
  experienceMonths: number;

  skills: string[];
  techStack: string[];

  github: string | null;
  portfolio: string | null;
  rank: number | null;
  score: number | null;

  badges: number | null;
  availability: "Available" | "Not available";
};

function parseArray(value: string | string[] | null): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  const text = value.trim();

  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
  } catch {
    // Not JSON, continue
  }

  // Comma separated value
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function fetchDevelopers(): Promise<DeveloperApiData[]> {
  const response = await fetch("/api/developer_finding", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch developers");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch developers");
  }

  return result.data || [];
}

function mapDeveloperData(developer: DeveloperApiData): Developer {
  return {
    // REAL API DATA
    id: developer.id,

    name: developer.fullName,

    avatar: developer.photo,

    country: developer.country || "Not specified",

    title: developer.title || "Developer",

    bio: developer.bio || "No bio available.",

    experienceYears: developer.experienceYears || 0,

    experienceMonths: developer.experienceMonths || 0,

    skills: parseArray(developer.skills),

    techStack: parseArray(developer.techStack),

    github: developer.github,

    portfolio: developer.portfolio,

    availability: developer.availability === 1 ? "Available" : "Not available",

    rank: developer.rank,

    score: developer.overallSkillScore,

    badges: developer.totalBadgeNumber,
  };
}

export default function DeveloperSearch() {
  const [developer, setDeveloper] = useState<Developer | null>(null);

  const [saved, setSaved] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDeveloper();
  }, []);

  async function loadDeveloper() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchDevelopers();

      if (!data.length) {
        throw new Error("No developer found");
      }

      const mappedDeveloper = mapDeveloperData(data[0]);

      setDeveloper(mappedDeveloper);
    } catch (error) {
      console.error("Developer fetch error:", error);

      setError("Unable to load developer profile.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-(--bg) px-4 py-10 text-(--text) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="h-150 animate-pulse rounded-3xl border border-(--border) bg-(--surface)" />
        </div>
      </main>
    );
  }

  if (error || !developer) {
    return (
      <main className="min-h-screen bg-(--bg) px-4 py-10 text-(--text) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-(--border) bg-(--surface) p-10 text-center">
            <h2 className="text-lg font-bold">Unable to load developer</h2>

            <p className="mt-2 text-sm text-(--text-muted)">
              {error || "Developer not found."}
            </p>

            <button
              type="button"
              onClick={loadDeveloper}
              className="mt-5 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--bg) px-4 py-10 text-(--text) sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <DeveloperCard
          developer={developer}
          saved={saved}
          onSave={() => setSaved((value) => !value)}
        />
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Developer Card                                                             */
/* -------------------------------------------------------------------------- */

function DeveloperCard({
  developer,
  saved,
  onSave,
}: {
  developer: Developer;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <article
      className="
        overflow-hidden
        rounded-3xl
        border
        border-(--border)
        bg-(--surface)
        shadow-(--shadow)
        transition
        duration-200
        hover:border-(--primary)/30
        hover:shadow-lg
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="p-6 sm:p-7">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative h-16 w-16 shrink-0">
            {developer.avatar ? (
              <Image
                width={64}
                height={64}
                src={developer.avatar}
                alt={developer.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  bg-(--primary)/10
                  text-xl
                  font-bold
                  text-(--primary)
                "
              >
                {developer.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Developer information */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-bold">
                    {developer.name}
                  </h2>
                </div>

                <p className="mt-1 text-sm text-(--text-muted)">
                  {developer.title}
                </p>
              </div>

              {/* Save */}
              <button
                type="button"
                onClick={onSave}
                aria-label="Save developer"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-(--border)
                  transition
                  hover:bg-(--surface-hover)
                "
              >
                {saved ? (
                  <BookmarkCheck size={18} className="text-(--primary)" />
                ) : (
                  <Bookmark size={18} />
                )}
              </button>
            </div>

            {/* Basic info */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-(--text-muted)">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {developer.country}
              </span>

              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness size={14} />
                {developer.experienceYears}y {developer.experienceMonths}m
                experience
              </span>

              <AvailabilityBadge availability={developer.availability} />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Bio                                                               */}
        {/* ---------------------------------------------------------------- */}

        <p className="mt-5 text-sm leading-6 text-(--text-muted)">
          {developer.bio}
        </p>

        {/* ---------------------------------------------------------------- */}
        {/* Main Metrics                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Metric
            icon={<Star size={16} />}
            label="Skill Score"
            value={`${developer.score}/100`}
          />

          <Metric
            icon={<Trophy size={16} />}
            label="Global Rank"
            value={`#${developer.rank}`}
          />

          <Metric
            icon={<Code2 size={16} />}
            label="Badges"
            value={developer.badges}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Technology Stack                                                  */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
            Technology Stack
          </p>

          <div className="flex flex-wrap gap-2">
            {developer.techStack.map((technology) => (
              <span
                key={technology}
                className="
                  rounded-lg
                  bg-(--surface-hover)
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                "
              >
                {technology}
              </span>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Skills                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="mt-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
            Skills
          </p>

          <div className="flex flex-wrap gap-2">
            {developer.skills.map((skill) => (
              <span
                key={skill}
                className="
                  rounded-lg
                  border
                  border-(--border)
                  px-3
                  py-1.5
                  text-xs
                  text-(--text-muted)
                "
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-t
          border-(--border)
          bg-(--surface-hover)/40
          px-6
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* External links */}
        <div className="flex items-center gap-2">
          {developer.github && (
            <a
              href={developer.github}
              target="_blank"
              rel="noreferrer"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-(--border)
                bg-(--surface)
                transition
                hover:bg-(--surface-hover)
              "
              aria-label="GitHub"
            >
              <FaGithub size={16} />
            </a>
          )}

          {developer.portfolio && (
            <a
              href={developer.portfolio}
              target="_blank"
              rel="noreferrer"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-(--border)
                bg-(--surface)
                transition
                hover:bg-(--surface-hover)
              "
              aria-label="Portfolio"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {/* View Profile */}
        <button
          type="button"
          onClick={() => {
            console.log("View developer:", developer.id);
          }}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-(--primary)
            px-5
            py-2.5
            text-sm
            font-bold
            text-white
            transition
            hover:bg-(--primary-hover)
          "
        >
          View Profile
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric                                                                      */
/* -------------------------------------------------------------------------- */

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-(--border)
        bg-(--surface-hover)/60
        px-3
        py-3.5
      "
    >
      <div className="flex items-center gap-1.5 text-(--text-muted)">
        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1.5 text-base font-bold">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Availability                                                               */
/* -------------------------------------------------------------------------- */

function AvailabilityBadge({
  availability,
}: {
  availability: Developer["availability"];
}) {
  const isAvailable = availability === "Available";

  const isOpenToOffers = availability === "Open to offers";

  return (
    <span
      className={`
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-semibold
        ${
          isAvailable
            ? "bg-emerald-500/10 text-emerald-600"
            : isOpenToOffers
              ? "bg-amber-500/10 text-amber-600"
              : "bg-slate-500/10 text-slate-500"
        }
      `}
    >
      {availability}
    </span>
  );
}
