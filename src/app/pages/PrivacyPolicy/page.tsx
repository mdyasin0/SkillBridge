"use client";

import {
  ShieldCheck,
  Database,
  UserRound,
  MessageSquare,
  Lock,
  Image as ImageIcon,
  Eye,
  RefreshCw,
  Mail,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    id: "information",
    title: "Information We Collect",
    icon: Database,
  },
  {
    id: "accounts",
    title: "Account Information",
    icon: UserRound,
  },
  {
    id: "profiles",
    title: "Developer & Recruiter Profiles",
    icon: UserRound,
  },
  {
    id: "performance",
    title: "Challenges & Performance",
    icon: ShieldCheck,
  },
  {
    id: "messaging",
    title: "Messaging",
    icon: MessageSquare,
  },
  {
    id: "images",
    title: "Profile Images",
    icon: ImageIcon,
  },
  {
    id: "usage",
    title: "How We Use Information",
    icon: Eye,
  },
  {
    id: "security",
    title: "Data Security",
    icon: Lock,
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: Database,
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    icon: RefreshCw,
  },
  {
    id: "contact",
    title: "Contact",
    icon: Mail,
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      {/* Hero */}
      <section className="border-b border-(--border) bg-(--surface)">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface-hover) px-4 py-2 text-sm font-medium text-(--primary)">
              <ShieldCheck size={17} />
              Privacy & Security
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-5 text-lg leading-8 text-(--text-muted)">
              Your privacy matters to SkillBridge. This policy explains what
              information we collect, how we use it, and how we protect your
              information while you use our platform.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-(--text-muted)">
              <span className="h-2 w-2 rounded-full bg-(--primary)" />
              Last updated: September 4, 2026
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-(--shadow)">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                On this page
              </p>

              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-(--text-muted) transition hover:bg-(--surface-hover) hover:text-(--text)"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={16} />
                        {section.title}
                      </span>

                      <ChevronRight
                        size={15}
                        className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main document */}
          <article className="min-w-0 rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow) sm:p-8 lg:p-10">
            <div className="space-y-12">
              <PolicySection
                id="information"
                number="01"
                title="Information We Collect"
              >
                <p>
                  When you use SkillBridge, we may collect information
                  necessary to create your account, build your professional
                  profile, evaluate challenge performance, provide messaging
                  functionality, and maintain platform security.
                </p>

                <ul>
                  <li>Name and email address</li>
                  <li>Password information in securely hashed form</li>
                  <li>Account role such as Developer or Recruiter</li>
                  <li>Account status and registration information</li>
                  <li>Profile and professional information</li>
                  <li>Challenge submissions and performance data</li>
                  <li>Messages exchanged through the platform</li>
                </ul>
              </PolicySection>

              <PolicySection
                id="accounts"
                number="02"
                title="Account Information"
              >
                <p>
                  To provide authentication and account management, SkillBridge
                  stores information associated with your account. Passwords
                  are not stored as plain text and are processed using secure
                  password hashing.
                </p>

                <p>
                  Your account may also contain a profile image, role,
                  account status, and other information required to operate
                  the platform.
                </p>
              </PolicySection>

              <PolicySection
                id="profiles"
                number="03"
                title="Developer & Recruiter Profiles"
              >
                <p>
                  Developers and recruiters may voluntarily provide
                  professional information to create their SkillBridge
                  profiles.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    title="Developer Profiles"
                    items={[
                      "Professional title",
                      "Biography",
                      "Experience",
                      "Education",
                      "Skills",
                      "Technology stack",
                      "Programming languages",
                      "GitHub / Portfolio / LinkedIn",
                    ]}
                  />

                  <InfoCard
                    title="Recruiter Profiles"
                    items={[
                      "Professional information",
                      "Company information",
                      "Recruitment specialization",
                      "Professional links",
                      "Profile photo",
                      "Company logo",
                    ]}
                  />
                </div>
              </PolicySection>

              <PolicySection
                id="performance"
                number="04"
                title="Challenges & Performance"
              >
                <p>
                  SkillBridge collects information related to coding
                  challenges, project-based assessments, submissions, scores,
                  attempts, completion status, reviews, feedback, rankings,
                  and badges.
                </p>

                <p>
                  This information is used to create a more meaningful
                  technical profile and help recruiters evaluate demonstrated
                  skills rather than relying only on resumes or certificates.
                </p>
              </PolicySection>

              <PolicySection
                id="messaging"
                number="05"
                title="Messaging"
              >
                <p>
                  SkillBridge provides messaging functionality between
                  developers and recruiters. Messages, conversation metadata,
                  timestamps, read status, and edited-message information may
                  be stored to provide and maintain the messaging service.
                </p>

                <div className="rounded-xl border border-(--border) bg-(--surface-hover) p-4">
                  <p className="text-sm">
                    Please do not share passwords, payment information, or
                    other highly sensitive information through SkillBridge
                    messages.
                  </p>
                </div>
              </PolicySection>

              <PolicySection
                id="images"
                number="06"
                title="Profile Images & Third-Party Image Hosting"
              >
                <p>
                  Users may upload profile photos or company logos. Depending
                  on the implementation, uploaded images may be processed and
                  hosted through a third-party image hosting provider such as
                  ImgBB.
                </p>

                <p>
                  By uploading an image, you confirm that you have the right
                  to use and publish that image.
                </p>
              </PolicySection>

              <PolicySection
                id="usage"
                number="07"
                title="How We Use Information"
              >
                <p>We may use collected information to:</p>

                <ul>
                  <li>Create and manage user accounts</li>
                  <li>Authenticate users</li>
                  <li>Provide role-based platform functionality</li>
                  <li>Display professional developer profiles</li>
                  <li>Process challenge submissions</li>
                  <li>Calculate scores, rankings, and badges</li>
                  <li>Allow recruiters to discover developers</li>
                  <li>Enable recruiter-developer communication</li>
                  <li>Maintain platform security and integrity</li>
                  <li>Improve platform functionality and user experience</li>
                </ul>
              </PolicySection>

              <PolicySection
                id="security"
                number="08"
                title="Data Security"
              >
                <p>
                  SkillBridge takes reasonable technical and organizational
                  measures to protect user information from unauthorized
                  access, modification, disclosure, or destruction.
                </p>

                <p>
                  However, no internet-based service can guarantee absolute
                  security. Users should maintain strong account credentials
                  and avoid sharing account information with others.
                </p>
              </PolicySection>

              <PolicySection
                id="retention"
                number="09"
                title="Data Retention"
              >
                <p>
                  We retain account, profile, challenge, performance, and
                  messaging information for as long as reasonably necessary to
                  provide SkillBridge services, maintain platform records,
                  resolve disputes, enforce platform rules, and comply with
                  applicable obligations.
                </p>
              </PolicySection>

              <PolicySection
                id="changes"
                number="10"
                title="Changes to This Privacy Policy"
              >
                <p>
                  SkillBridge may update this Privacy Policy when platform
                  functionality, security practices, or legal requirements
                  change.
                </p>

                <p>
                  When significant changes are made, the updated version will
                  be published on this page with a revised “Last updated”
                  date.
                </p>
              </PolicySection>

              <PolicySection id="contact" number="11" title="Contact">
                <p>
                  If you have questions, concerns, or requests regarding this
                  Privacy Policy or your personal information, please contact
                  the SkillBridge platform administration team.
                </p>
              </PolicySection>

              {/* Footer notice */}
              <div className="rounded-2xl border border-(--primary)/20 bg-(--primary)/5 p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-(--primary)"
                    size={20}
                  />

                  <div>
                    <h3 className="font-semibold">Your Privacy Matters</h3>
                    <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                      By using SkillBridge, you acknowledge that you have read
                      and understood this Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-5 flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-xs font-bold text-(--primary)">
          {number}
        </span>

        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="space-y-4 pl-0 text-[15px] leading-7 text-(--text-muted) sm:pl-13">
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface-hover) p-5">
      <h3 className="font-semibold text-(--text)">{title}</h3>

      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--primary)" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}