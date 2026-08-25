"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Code2,
  ExternalLink,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Trophy,
  X,
} from "lucide-react";

import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

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
  completedChallenges: number | null;
  overallSkillScore: number | null;

  totalBadgeNumber: number | null;
};

type Developer = {
  id: number;
  userId: number;
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
  completedChallenges: number;
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
    userId: developer.userId,
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
    completedChallenges: developer.completedChallenges ?? 0,
    badges: developer.totalBadgeNumber,
  };
}

export default function DeveloperSearch() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [showCount, setShowCount] = useState(20);
  const ITEMS_PER_LOAD = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [saved, setSaved] = useState(false);
  const [showSorting, setShowSorting] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Highest Score");
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  function toggleFilters() {
    setShowFilters((value) => !value);
    setShowSorting(false);
  }

  function toggleSorting() {
    setShowSorting((value) => !value);
    setShowFilters(false);
  }
  useEffect(() => {
    loadDeveloper();
  }, []);

  async function loadDeveloper() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchDevelopers();

      if (!data.length) {
        throw new Error("No developers found");
      }

      const mappedDevelopers = data.map(mapDeveloperData);

      setDevelopers(mappedDevelopers);
    } catch (error) {
      console.error("Developer fetch error:", error);

      setError("Unable to load developer profile.");
    } finally {
      setLoading(false);
    }
  }

  const technologyOptions = Array.from(
    new Set(
      developers.flatMap((developer) =>
        developer.skills.map((skill) => skill.trim()).filter(Boolean),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const countryOptions = Array.from(
    new Set(
      developers.map((developer) => developer.country.trim()).filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const filteredDevelopers = developers.filter((developer) => {
    /* ---------------------------------------------------------------------- */
    /* Technology                                                             */
    /* ---------------------------------------------------------------------- */

    const matchesTechnology =
      !selectedTechnology ||
      developer.skills.some(
        (skill) =>
          skill.trim().toLowerCase() ===
          selectedTechnology.trim().toLowerCase(),
      );

    /* ---------------------------------------------------------------------- */
    /* Country                                                                */
    /* ---------------------------------------------------------------------- */

    const matchesCountry =
      !selectedCountry ||
      developer.country.trim().toLowerCase() ===
        selectedCountry.trim().toLowerCase();

    /* ---------------------------------------------------------------------- */
    /* Experience                                                             */
    /* ---------------------------------------------------------------------- */

    const totalExperience =
      developer.experienceYears + developer.experienceMonths / 12;

    let matchesExperience = true;

    if (selectedExperience === "0–1 years") {
      matchesExperience = totalExperience < 1;
    } else if (selectedExperience === "1–3 years") {
      matchesExperience = totalExperience >= 1 && totalExperience < 3;
    } else if (selectedExperience === "3–5 years") {
      matchesExperience = totalExperience >= 3 && totalExperience < 5;
    } else if (selectedExperience === "5–10 years") {
      matchesExperience = totalExperience >= 5 && totalExperience < 10;
    } else if (selectedExperience === "10+ years") {
      matchesExperience = totalExperience >= 10;
    }

    /* ---------------------------------------------------------------------- */
    /* Badge                                                                   */
    /* ---------------------------------------------------------------------- */

    const badgeCount = developer.badges ?? 0;

    let matchesBadge = true;

    if (selectedBadge === "1+ badges") {
      matchesBadge = badgeCount >= 1;
    } else if (selectedBadge === "5+ badges") {
      matchesBadge = badgeCount >= 5;
    } else if (selectedBadge === "10+ badges") {
      matchesBadge = badgeCount >= 10;
    } else if (selectedBadge === "20+ badges") {
      matchesBadge = badgeCount >= 20;
    } else if (selectedBadge === "50+ badges") {
      matchesBadge = badgeCount >= 50;
    }

    /* ---------------------------------------------------------------------- */
    /* Rank                                                                    */
    /* ---------------------------------------------------------------------- */

    const developerRank = developer.rank ?? Infinity;

    let matchesRank = true;

    if (selectedRank === "Top 10") {
      matchesRank = developerRank <= 10;
    } else if (selectedRank === "Top 50") {
      matchesRank = developerRank <= 50;
    } else if (selectedRank === "Top 100") {
      matchesRank = developerRank <= 100;
    } else if (selectedRank === "Top 500") {
      matchesRank = developerRank <= 500;
    } else if (selectedRank === "Top 1000") {
      matchesRank = developerRank <= 1000;
    }
    const search = searchQuery.trim().toLowerCase();

    const searchableText = [
      developer.title,
      developer.country,
      developer.bio,
      ...developer.skills,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !search || searchableText.includes(search);
    /* ---------------------------------------------------------------------- */
    /* Availability                                                            */
    /* ---------------------------------------------------------------------- */

    const matchesAvailability =
      !selectedAvailability || developer.availability === selectedAvailability;

    /* ---------------------------------------------------------------------- */
    /* Final result                                                            */
    /* ---------------------------------------------------------------------- */
    return (
      matchesSearch &&
      matchesTechnology &&
      matchesCountry &&
      matchesExperience &&
      matchesBadge &&
      matchesRank &&
      matchesAvailability
    );
  });

  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    switch (selectedSort) {
      case "Highest Score": {
        const scoreA = a.score ?? 0;
        const scoreB = b.score ?? 0;

        return scoreB - scoreA;
      }

      case "Highest Rank": {
        const rankA = a.rank ?? Infinity;
        const rankB = b.rank ?? Infinity;

        return rankA - rankB;
      }

      case "Most Experienced": {
        const experienceA = a.experienceYears + a.experienceMonths / 12;

        const experienceB = b.experienceYears + b.experienceMonths / 12;

        return experienceB - experienceA;
      }

      case "Most Challenges": {
        return b.completedChallenges - a.completedChallenges;
      }

      default:
        return 0;
    }
  });

  const visibleDevelopers = sortedDevelopers.slice(0, showCount);

  const hasMoreDevelopers = showCount < sortedDevelopers.length;
  useEffect(() => {
    setShowCount(20);
  }, [
    searchQuery,
    selectedTechnology,
    selectedCountry,
    selectedExperience,
    selectedBadge,
    selectedRank,
    selectedAvailability,
    selectedSort,
  ]);
  if (loading) {
    return (
      <main className="min-h-screen bg-(--bg) px-4 py-10 text-(--text) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="h-150 animate-pulse rounded-3xl border border-(--border) bg-(--surface)" />
        </div>
      </main>
    );
  }

  if (error || !developers.length) {
    return (
      <main className="min-h-screen bg-(--bg) px-4 py-10 text-(--text) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-(--border) bg-(--surface) p-10 text-center">
            <h2 className="text-lg font-bold">Unable to load developer</h2>

            <p className="mt-2 text-sm text-(--text-muted)">
              {error || "No developers found."}
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
      {" "}
      {/* ================================================================== */}{" "}
      {/* Search / Filter Layer */}{" "}
      {/* ================================================================== */}{" "}
      <section className="mb-6">
        {" "}
        {/* ---------------------------------------------------------------- */}{" "}
        {/* Heading */}{" "}
        {/* ---------------------------------------------------------------- */}{" "}
        <div className="mb-6">
          {" "}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {" "}
            Find the Right Developer{" "}
          </h1>{" "}
          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--text-muted)">
            {" "}
            Discover skilled developers based on their experience, technology
            stack, skills, ranking, and availability.{" "}
          </p>{" "}
        </div>{" "}
        {/* ---------------------------------------------------------------- */}{" "}
        {/* Search + Filter + Sort */}{" "}
        {/* ---------------------------------------------------------------- */}{" "}
        <div className="flex items-center gap-3">
          {" "}
          {/* Search */}{" "}
          <div className=" flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 shadow-(--shadow) transition focus-within:border-(--primary)/40 focus-within:ring-2 focus-within:ring-(--primary)/10 ">
            {" "}
            <Search size={19} className="shrink-0 text-(--text-muted)" />{" "}
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search developers by name, title, skill, country, bio..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-(--text-muted)"
            />{" "}
          </div>{" "}
          {/* Filter + Sort */}{" "}
          <div className="flex shrink-0 items-center gap-3">
            {" "}
            {/* Filter Button */}{" "}
            <button
              type="button"
              onClick={toggleFilters}
              aria-expanded={showFilters}
              className={` flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${showFilters ? "border-(--primary)/30 bg-(--primary)/10 text-(--primary)" : "border-(--border) bg-(--surface) hover:bg-(--surface-hover)"} `}
            >
              {" "}
              <SlidersHorizontal size={16} /> Filters{" "}
              <ChevronDown
                size={15}
                className={` ml-1 text-(--text-muted) transition-transform duration-200 ${showFilters ? "rotate-180" : ""} `}
              />{" "}
            </button>{" "}
            {/* Sort Button */}{" "}
            <button
              type="button"
              onClick={toggleSorting}
              aria-expanded={showSorting}
              className={` flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${showSorting ? "border-(--primary)/30 bg-(--primary)/10 text-(--primary)" : "border-(--border) bg-(--surface) hover:bg-(--surface-hover)"} `}
            >
              {" "}
              <ArrowUpDown size={16} /> Sort{" "}
              <ChevronDown
                size={15}
                className={` ml-1 text-(--text-muted) transition-transform duration-200 ${showSorting ? "rotate-180" : ""} `}
              />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* ---------------------------------------------------------------- */}{" "}
        {/* Filter Panel */}{" "}
        {/* ---------------------------------------------------------------- */}{" "}
        {showFilters && (
          <div className=" mt-4 rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow) animate-in fade-in slide-in-from-top-2 duration-200 ">
            {" "}
            <div className="flex items-center justify-between gap-3">
              {" "}
              <div>
                {" "}
                <h2 className="text-sm font-bold"> Filter Developers </h2>{" "}
                <p className="mt-1 text-xs text-(--text-muted)">
                  {" "}
                  Narrow down developers using their profile data.{" "}
                </p>{" "}
              </div>{" "}
              <button
                type="button"
                onClick={() => {
                  setSelectedTechnology("");
                  setSelectedCountry("");
                  setSelectedExperience("");
                  setSelectedBadge("");
                  setSelectedRank("");
                  setSelectedAvailability("");
                }}
                className="
    flex
    items-center
    gap-1
    text-xs
    font-semibold
    text-(--text-muted)
    transition
    hover:text-(--text)
  "
              >
                <X size={14} />
                Clear
              </button>{" "}
            </div>{" "}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FilterSelect
                label="Technology"
                placeholder="All technologies"
                options={technologyOptions}
                value={selectedTechnology}
                onChange={setSelectedTechnology}
              />

              <FilterSelect
                label="Country"
                placeholder="All countries"
                options={countryOptions}
                value={selectedCountry}
                onChange={setSelectedCountry}
              />

              <FilterSelect
                label="Experience"
                placeholder="Any experience"
                options={[
                  "0–1 years",
                  "1–3 years",
                  "3–5 years",
                  "5–10 years",
                  "10+ years",
                ]}
                value={selectedExperience}
                onChange={setSelectedExperience}
              />

              <FilterSelect
                label="Badge"
                placeholder="Any badges"
                options={[
                  "1+ badges",
                  "5+ badges",
                  "10+ badges",
                  "20+ badges",
                  "50+ badges",
                ]}
                value={selectedBadge}
                onChange={setSelectedBadge}
              />

              <FilterSelect
                label="Rank"
                placeholder="Any rank"
                options={["Top 10", "Top 50", "Top 100", "Top 500", "Top 1000"]}
                value={selectedRank}
                onChange={setSelectedRank}
              />

              <FilterSelect
                label="Available for Work"
                placeholder="Any availability"
                options={["Available", "Not available"]}
                value={selectedAvailability}
                onChange={setSelectedAvailability}
              />
            </div>{" "}
          </div>
        )}{" "}
        {/* ---------------------------------------------------------------- */}{" "}
        {/* Sorting Panel */}{" "}
        {/* ---------------------------------------------------------------- */}{" "}
        {showSorting && (
          <div className=" mt-4 rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow) animate-in fade-in slide-in-from-top-2 duration-200 ">
            {" "}
            <div>
              {" "}
              <h2 className="text-sm font-bold"> Sort Developers </h2>{" "}
              <p className="mt-1 text-xs text-(--text-muted)">
                {" "}
                Choose how developer results should be ordered.{" "}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 flex flex-wrap gap-2">
              {" "}
              <SortOption
                label="Highest Score"
                active={selectedSort === "Highest Score"}
                onClick={() => setSelectedSort("Highest Score")}
              />
              <SortOption
                label="Highest Rank"
                active={selectedSort === "Highest Rank"}
                onClick={() => setSelectedSort("Highest Rank")}
              />
              <SortOption
                label="Most Experienced"
                active={selectedSort === "Most Experienced"}
                onClick={() => setSelectedSort("Most Experienced")}
              />
              <SortOption
                label="Most Challenges"
                active={selectedSort === "Most Challenges"}
                onClick={() => setSelectedSort("Most Challenges")}
              />
            </div>{" "}
          </div>
        )}{" "}
      </section>{" "}
      {/* ================================================================== */}{" "}
      {/* Result Layer Divider */}{" "}
      {/* ================================================================== */}{" "}
      <div className="mb-7 flex items-center gap-4">
        {" "}
        <div className="h-px flex-1 bg-(--border)" />{" "}
        <span className=" rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-(--text-muted) ">
          {" "}
          Developer Results{" "}
        </span>{" "}
        <div className="h-px flex-1 bg-(--border)" />{" "}
      </div>{" "}
      {/* ================================================================== */}{" "}
      {/* Result Layer */}{" "}
      {/* ================================================================== */}{" "}
      <section>
        {filteredDevelopers.length > 0 ? (
          <div
            className="
        grid
        grid-cols-1
        gap-5
        lg:grid-cols-2
      "
          >
            {visibleDevelopers.map((developer) => (
              <DeveloperCard
                key={developer.id}
                developer={developer}
                saved={saved}
                onSave={() => setSaved((value) => !value)}
              />
            ))}
          </div>
        ) : (
          <div
            className="
        rounded-3xl
        border
        border-(--border)
        bg-(--surface)
        px-6
        py-14
        text-center
        shadow-(--shadow)
      "
          >
            <h2 className="text-lg font-bold">No developers found</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--text-muted)">
              No developers match your selected filters. Try changing or
              clearing one or more filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedTechnology("");
                setSelectedCountry("");
                setSelectedExperience("");
                setSelectedBadge("");
                setSelectedRank("");
                setSelectedAvailability("");
              }}
              className="
          mt-5
          rounded-xl
          bg-(--primary)
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-(--primary-hover)
        "
            >
              Clear Filters
            </button>
          </div>
        )}
        {sortedDevelopers.length > 20 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-(--text-muted)">
              Showing {visibleDevelopers.length} of {sortedDevelopers.length}{" "}
              developers
            </p>

            <button
              type="button"
              onClick={() => {
                if (hasMoreDevelopers) {
                  setShowCount((current) =>
                    Math.min(current + ITEMS_PER_LOAD, sortedDevelopers.length),
                  );
                } else {
                  setShowCount(20);
                }
              }}
              className="
        rounded-xl
        border
        border-(--border)
        bg-(--surface)
        px-6
        py-2.5
        text-sm
        font-semibold
        shadow-(--shadow)
        transition
        hover:bg-(--surface-hover)
      "
            >
              {hasMoreDevelopers ? "See More" : "See Less"}
            </button>
          </div>
        )}
      </section>{" "}
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
            <div className="tooltip" data-tip="github">
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
            </div>
          )}

          {developer.portfolio && (
            <div className="tooltip" data-tip="portfolio">
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
            </div>
          )}
        </div>
        {/* View Profile */}
        <Link
          href={`/pages/recruiter/developer_profile_details/${developer.userId}`}
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
        </Link>
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
              : "bg-slate-500/10 text-slate-500"
          }
      `}
    >
      {availability}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter Select                                                              */
/* -------------------------------------------------------------------------- */

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            w-full
            appearance-none
            rounded-xl
            border
            border-(--border)
            bg-(--surface-hover)/60
            px-3.5
            py-2.5
            pr-9
            text-sm
            outline-none
            transition
            focus:border-(--primary)/40
            focus:ring-2
            focus:ring-(--primary)/10
          "
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-(--text-muted)
          "
        />
      </div>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Sort Option                                                                */
/* -------------------------------------------------------------------------- */

function SortOption({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl
        border
        px-3.5
        py-2
        text-xs
        font-semibold
        transition
        ${
          active
            ? "border-(--primary)/30 bg-(--primary)/10 text-(--primary)"
            : "border-(--border) bg-(--surface-hover)/60 text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text)"
        }
      `}
    >
      {label}
    </button>
  );
}
