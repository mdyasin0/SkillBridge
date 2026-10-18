"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  BriefcaseBusiness,
  BriefcaseBusinessIcon,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { LiaLinkedin, LiaLinkedinIn } from "react-icons/lia";
import { BsTwitter } from "react-icons/bs";
import LoadingUI from "@/components/Loadinui";
import { toast } from "react-toastify";

interface RecruiterProfile {
  id: number;
  user_id: number | string;

  profilePhoto?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;

  location?: string | null;
  country?: string | null;
  city?: string | null;

  bio?: string | null;

  jobTitle?: string | null;
  department?: string | null;
  experienceYears?: number | null;
  specialization?: string | null;
  recruitmentType?: string | null;

  companyLogo?: string | null;
  companyName?: string | null;
  companyWebsite?: string | null;
  companyDescription?: string | null;
  industry?: string | null;
  companySize?: string | null;
  companyLocation?: string | null;
  companyFoundedYear?: number | null;

  linkedin?: string | null;
  twitter?: string | null;
  companyLinkedin?: string | null;

  verificationstatus?: number | string | null;
  verified_at?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}

interface RecruiterProfileResponse {
  message: string;
  data: RecruiterProfile;
}

export default function RecruiterProfilePage() {
  const { user } = useAuth();
  const userId = user.id;

  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecruiterProfile = async () => {
      if (!userId) {
        setError("Recruiter user ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/recruter_full_profile?userId=${encodeURIComponent(userId)}`,
          {
            cache: "no-store",
          },
        );

        const result: RecruiterProfileResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to load recruiter profile.",
          );
        }

        setProfile(result.data);
      } catch (error) {
        toast.error(String(error));

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load recruiter profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterProfile();
  }, [userId]);

  const getInitials = (name?: string | null) => {
    if (!name) return "R";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isVerified =
    profile?.verificationstatus === 1 ||
    profile?.verificationstatus === "1" ||
    profile?.verificationstatus === "verified" ||
    profile?.verificationstatus === "Verified";

  /*
  --------------------------------------------------
  Loading
  --------------------------------------------------
  */

  if (loading) {
    return <LoadingUI />;
  }

  /*
  --------------------------------------------------
  Error
  --------------------------------------------------
  */

  if (error || !profile) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-(--bg) px-3 py-6 text-(--text) sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-(--border) bg-(--surface) p-5 text-center shadow-(--shadow) sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--bg-secondary)">
            <UserRound size={26} className="text-(--text-muted)" />
          </div>

          <h1 className="mt-4 text-lg font-semibold">
            Recruiter profile unavailable
          </h1>

          <p className="mt-2 break-words text-sm leading-6 text-(--text-muted)">
            {error || "We couldn't find this recruiter profile."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-(--bg) text-(--text)">
      <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* =====================================================
            PROFILE HERO
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow) sm:rounded-3xl">
          {/* Cover */}

          <div className="h-24 bg-(--bg-secondary) sm:h-32 md:h-40" />

          {/* Profile Header */}

          <div className="px-4 pb-5 sm:px-6 sm:pb-7 lg:px-8 lg:pb-8">
            <div className="-mt-12 flex min-w-0 flex-col gap-4 sm:-mt-14 md:-mt-16 md:flex-row md:items-end md:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                {/* Profile Photo */}

                <div className="relative w-fit shrink-0">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-(--surface) bg-(--primary) text-2xl font-bold text-(--bg-secondary) shadow-(--shadow) sm:h-28 sm:w-28 sm:text-3xl md:h-32 md:w-32">
                    {profile.profilePhoto ? (
                      <Image
                        src={profile.profilePhoto}
                        alt={profile.fullName || "Recruiter"}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(profile.fullName)
                    )}
                  </div>

                  {isVerified && (
                    <div
                      className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-(--surface) bg-(--primary) text-(--bg-secondary) sm:h-8 sm:w-8"
                      title="Verified recruiter"
                    >
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>

                {/* Main Identity */}

                <div className="min-w-0 pb-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h1 className="min-w-0 max-w-full break-words text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                      {profile.fullName || "Recruiter"}
                    </h1>

                    {isVerified && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-(--border) bg-(--bg-secondary) px-2.5 py-1 text-xs font-medium text-(--text)">
                        <ShieldCheck size={13} />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-1 break-words text-sm font-medium text-(--text-muted)">
                    {profile.jobTitle || "Recruiter"}
                  </p>

                  <div className="mt-3 flex min-w-0 flex-wrap gap-x-4 gap-y-2 text-xs text-(--text-muted)">
                    {profile.companyName && (
                      <span className="inline-flex min-w-0 max-w-full items-start gap-1.5">
                        <Building2 size={14} className="mt-0.5 shrink-0" />
                        <span className="break-words">{profile.companyName}</span>
                      </span>
                    )}

                    {(profile.city || profile.country) && (
                      <span className="inline-flex min-w-0 max-w-full items-start gap-1.5">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="break-words">
                          {[profile.city, profile.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </span>
                    )}

                    {profile.department && (
                      <span className="inline-flex min-w-0 max-w-full items-start gap-1.5">
                        <BriefcaseBusiness
                          size={14}
                          className="mt-0.5 shrink-0"
                        />
                        <span className="break-words">
                          {profile.department}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}

            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-(--border) bg-(--border) sm:mt-7 sm:grid-cols-4 sm:rounded-2xl">
              <StatItem
                label="Experience"
                value={
                  profile.experienceYears !== null &&
                  profile.experienceYears !== undefined
                    ? `${profile.experienceYears} ${
                        profile.experienceYears === 1 ? "Year" : "Years"
                      }`
                    : "—"
                }
              />

              <StatItem
                label="Department"
                value={profile.department || "—"}
              />

              <StatItem
                label="Recruitment"
                value={profile.recruitmentType || "—"}
              />

              <StatItem
                label="Industry"
                value={profile.industry || "—"}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-3">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="min-w-0 space-y-4 sm:space-y-6">
            {/* Contact */}

            <ProfileCard
              title="Contact Information"
              icon={<UserRound size={18} />}
            >
              <InfoRow
                icon={<Mail size={16} />}
                label="Email"
                value={profile.email}
                href={
                  profile.email
                    ? `mailto:${profile.email}`
                    : undefined
                }
              />

              <InfoRow
                icon={<Phone size={16} />}
                label="Phone"
                value={profile.phone}
                href={
                  profile.phone
                    ? `tel:${profile.phone}`
                    : undefined
                }
              />

              <InfoRow
                icon={<MapPin size={16} />}
                label="Location"
                value={
                  profile.location ||
                  [profile.city, profile.country]
                    .filter(Boolean)
                    .join(", ")
                }
              />
            </ProfileCard>

            {/* Recruiter Details */}

            <ProfileCard
              title="Recruiter Details"
              icon={<BriefcaseBusiness size={18} />}
            >
              <InfoRow
                icon={<BriefcaseBusiness size={16} />}
                label="Job Title"
                value={profile.jobTitle}
              />

              <InfoRow
                icon={<Building2 size={16} />}
                label="Department"
                value={profile.department}
              />

              <InfoRow
                icon={<CalendarDays size={16} />}
                label="Experience"
                value={
                  profile.experienceYears !== null &&
                  profile.experienceYears !== undefined
                    ? `${profile.experienceYears} years`
                    : undefined
                }
              />

              <InfoRow
                icon={<Users size={16} />}
                label="Recruitment Type"
                value={profile.recruitmentType}
              />

              <InfoRow
                icon={<Globe size={16} />}
                label="Specialization"
                value={profile.specialization}
              />
            </ProfileCard>

            {/* Social Profiles */}

            <ProfileCard
              title="Social Profiles"
              icon={<Globe size={18} />}
            >
              <SocialLink
                icon={<LiaLinkedinIn size={17} />}
                label="LinkedIn"
                href={profile.linkedin}
              />

              <SocialLink
                icon={<BsTwitter size={17} />}
                label="Twitter"
                href={profile.twitter}
              />
            </ProfileCard>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
            {/* About Recruiter */}

            <ProfileCard
              title="About the Recruiter"
              icon={<UserRound size={18} />}
            >
              {profile.bio ? (
                <p className="break-words whitespace-pre-line text-sm leading-7 text-(--text-muted)">
                  {profile.bio}
                </p>
              ) : (
                <EmptyValue text="No recruiter bio has been provided." />
              )}
            </ProfileCard>

            {/* Company */}

            <section className="min-w-0 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-(--shadow) sm:p-5 md:p-6">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--bg-secondary) text-(--primary)">
                    <Building2 size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="break-words text-base font-semibold">
                      Company Information
                    </h2>

                    <p className="mt-0.5 break-words text-xs leading-5 text-(--text-muted)">
                      Organization represented by this recruiter
                    </p>
                  </div>
                </div>

                {profile.companyWebsite && (
                  <a
                    href={profile.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 w-fit max-w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-(--border) px-3 py-2 text-xs font-medium text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--text)"
                  >
                    <Globe size={14} />
                    Website
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Company Identity */}

              <div className="mt-5 flex min-w-0 flex-col gap-3 rounded-xl border border-(--border) bg-(--bg-secondary) p-3 sm:mt-6 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-(--border) bg-(--surface) text-xl font-bold sm:h-16 sm:w-16">
                  {profile.companyLogo ? (
                    <Image
                      src={profile.companyLogo}
                      alt={profile.companyName || "Company"}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(profile.companyName)
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-lg font-semibold">
                    {profile.companyName || "Company name unavailable"}
                  </h3>

                  <p className="mt-1 break-words text-sm text-(--text-muted)">
                    {profile.industry || "Industry not specified"}
                  </p>
                </div>
              </div>

              {/* Company Description */}

              <div className="mt-5 min-w-0 sm:mt-6">
                <h3 className="text-sm font-semibold">
                  About the Company
                </h3>

                <p className="mt-2 break-words whitespace-pre-line text-sm leading-7 text-(--text-muted)">
                  {profile.companyDescription ||
                    "No company description has been provided."}
                </p>
              </div>

              {/* Company Details */}

              <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 border-t border-(--border) pt-5 sm:mt-6 sm:grid-cols-2 sm:gap-4 sm:pt-6">
                <DetailBox
                  icon={<Building2 size={17} />}
                  label="Industry"
                  value={profile.industry}
                />

                <DetailBox
                  icon={<Users size={17} />}
                  label="Company Size"
                  value={profile.companySize}
                />

                <DetailBox
                  icon={<MapPin size={17} />}
                  label="Company Location"
                  value={profile.companyLocation}
                />

                <DetailBox
                  icon={<CalendarDays size={17} />}
                  label="Founded"
                  value={
                    profile.companyFoundedYear
                      ? String(profile.companyFoundedYear)
                      : undefined
                  }
                />
              </div>

              {/* Company LinkedIn */}

              {profile.companyLinkedin && (
                <div className="mt-5 border-t border-(--border) pt-4 sm:mt-6 sm:pt-5">
                  <SocialLink
                    icon={<LiaLinkedin size={17} />}
                    label="Company LinkedIn"
                    href={profile.companyLinkedin}
                  />
                </div>
              )}
            </section>

            {/* Professional Focus */}

            <ProfileCard
              title="Recruitment Focus"
              icon={<BriefcaseBusinessIcon size={18} />}
            >
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <DetailBox
                  icon={<BriefcaseBusiness size={17} />}
                  label="Specialization"
                  value={profile.specialization}
                />

                <DetailBox
                  icon={<Users size={17} />}
                  label="Recruitment Type"
                  value={profile.recruitmentType}
                />

                <DetailBox
                  icon={<Building2 size={17} />}
                  label="Department"
                  value={profile.department}
                />

                <DetailBox
                  icon={<CalendarDays size={17} />}
                  label="Experience"
                  value={
                    profile.experienceYears !== null &&
                    profile.experienceYears !== undefined
                      ? `${profile.experienceYears} years`
                      : undefined
                  }
                />
              </div>
            </ProfileCard>

            {/* Verification */}

            <ProfileCard
              title="Verification"
              icon={<ShieldCheck size={18} />}
            >
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--bg-secondary)">
                    <ShieldCheck
                      size={20}
                      className="text-(--primary)"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">
                      {isVerified
                        ? "Verified Recruiter"
                        : "Verification Pending"}
                    </p>

                    <p className="mt-1 break-words text-xs leading-5 text-(--text-muted)">
                      {isVerified
                        ? "This recruiter profile has been verified."
                        : "This recruiter has not completed verification yet."}
                    </p>
                  </div>
                </div>

                {profile.verified_at && (
                  <div className="min-w-0 text-left sm:shrink-0 sm:text-right">
                    <p className="text-[11px] text-(--text-muted)">
                      Verified on
                    </p>

                    <p className="mt-1 break-words text-xs font-medium">
                      {formatDate(profile.verified_at)}
                    </p>
                  </div>
                )}
              </div>
            </ProfileCard>

            {/* Profile Metadata */}

            <div className="grid min-w-0 grid-cols-1 gap-3 text-xs text-(--text-muted) sm:grid-cols-2 sm:gap-4">
              <div className="min-w-0 rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
                <span>Profile created</span>

                <p className="mt-1 break-words font-medium text-(--text)">
                  {formatDate(profile.created_at)}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
                <span>Last updated</span>

                <p className="mt-1 break-words font-medium text-(--text)">
                  {formatDate(profile.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/*
=========================================================
STAT ITEM
=========================================================
*/

function StatItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 bg-(--bg-secondary) px-3 py-3.5 sm:px-4 sm:py-4 lg:px-5">
      <p className="break-words text-[10px] font-medium uppercase tracking-wide text-(--text-muted) sm:text-[11px]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}

/*
=========================================================
PROFILE CARD
=========================================================
*/

function ProfileCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-(--shadow) sm:p-5 md:p-6">
      <div className="flex min-w-0 items-center gap-3 border-b border-(--border) pb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--bg-secondary) text-(--primary)">
          {icon}
        </div>

        <h2 className="min-w-0 break-words text-base font-semibold">
          {title}
        </h2>
      </div>

      <div className="min-w-0 pt-4 sm:pt-5">{children}</div>
    </section>
  );
}

/*
=========================================================
INFO ROW
=========================================================
*/

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  href?: string;
}) {
  return (
    <div className="flex min-w-0 gap-3 border-b border-(--border) py-3.5 last:border-b-0 last:pb-0 first:pt-0">
      <div className="mt-0.5 shrink-0 text-(--text-muted)">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-(--text-muted)">
          {label}
        </p>

        {value ? (
          href ? (
            <a
              href={href}
              className="mt-1 block break-words text-sm font-medium text-(--text) transition-colors hover:text-(--primary)"
            >
              {value}
            </a>
          ) : (
            <p className="mt-1 break-words text-sm font-medium">
              {value}
            </p>
          )
        ) : (
          <p className="mt-1 text-sm text-(--text-muted)">
            Not provided
          </p>
        )}
      </div>
    </div>
  );
}

/*
=========================================================
DETAIL BOX
=========================================================
*/

function DetailBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-xl border border-(--border) bg-(--bg-secondary) p-3.5 sm:p-4">
      <div className="mt-0.5 shrink-0 text-(--text-muted)">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-(--text-muted)">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

/*
=========================================================
SOCIAL LINK
=========================================================
*/

function SocialLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string | null;
}) {
  if (!href) {
    return (
      <div className="flex min-w-0 items-center gap-3 py-2 text-sm text-(--text-muted)">
        <span className="shrink-0">{icon}</span>
        <span className="min-w-0 break-words">{label}</span>
        <span className="ml-auto shrink-0 text-right text-xs">
          Not provided
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-(--surface-hover)"
    >
      <span className="shrink-0 text-(--text-muted)">
        {icon}
      </span>

      <span className="min-w-0 break-words font-medium">
        {label}
      </span>

      <ExternalLink
        size={14}
        className="ml-auto shrink-0 text-(--text-muted)"
      />
    </a>
  );
}

/*
=========================================================
EMPTY VALUE
=========================================================
*/

function EmptyValue({ text }: { text: string }) {
  return (
    <p className="break-words text-sm leading-6 text-(--text-muted)">
      {text}
    </p>
  );
}