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
  X,
  Menu,
} from "lucide-react";

import { useEffect, useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen]);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <main className="min-h-screen min-w-0 overflow-x-clip bg-(--bg) text-(--text)">
      {/* Main Layout */}
      <section className="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[30%_minmax(0,1fr)] lg:gap-6 xl:gap-8">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open privacy policy navigation"
            aria-controls="privacy-sidebar"
            aria-expanded={sidebarOpen}
            className="fixed left-0 top-1/2 z-40 flex h-12 w-10 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-(--border) bg-(--surface) text-(--primary) shadow-(--shadow) transition-colors hover:bg-(--surface-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Mobile Backdrop */}
          <button
            type="button"
            aria-label="Close privacy policy navigation"
            aria-hidden={!sidebarOpen}
            tabIndex={sidebarOpen ? 0 : -1}
            onClick={closeSidebar}
            className={`fixed inset-0 z-50 bg-(--text)/40 transition-opacity duration-300 lg:hidden ${
              sidebarOpen
                ? "visible opacity-100"
                : "invisible pointer-events-none opacity-0"
            }`}
          />

          {/* Sidebar */}
          <aside
            id="privacy-sidebar"
            aria-label="Privacy policy navigation"
            aria-hidden={
              typeof window !== "undefined" &&
              window.matchMedia("(min-width: 1024px)").matches
                ? false
                : !sidebarOpen
            }
            className={`fixed inset-y-0 left-0 z-[60] flex w-[min(82vw,360px)] flex-col overflow-y-auto border-r border-(--border) bg-(--surface) p-4 shadow-(--shadow) transition-transform duration-300 ease-in-out sm:p-5 lg:sticky lg:top-6 lg:z-auto lg:h-[calc(100vh-3rem)] lg:w-full lg:translate-x-0 lg:rounded-2xl lg:border lg:shadow-(--shadow) ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Mobile Sidebar Header */}
            <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
              <div className="flex min-w-0 items-center gap-2">
                <ShieldCheck size={21} className="shrink-0 text-(--primary)" />

                <p className="truncate text-base font-semibold text-(--text)">
                  Privacy Navigation
                </p>
              </div>

              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close navigation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border) text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Desktop Sidebar Header */}
            <div className="mb-5 hidden border-b border-(--border) pb-4 lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
                  <ShieldCheck size={22} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-(--text)">
                    Privacy Policy
                  </h2>

                  <p className="mt-1 text-xs text-(--text-muted)">
                    SkillBridge documentation
                  </p>
                </div>
              </div>
            </div>

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
              On this page
            </p>

            <nav aria-label="Privacy policy sections" className="space-y-1">
              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(event) => {
                      event.preventDefault();

                      const target = document.getElementById(section.id);

                      if (target) {
                        window.history.replaceState(null, "", `#${section.id}`);

                        target.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }

                      closeSidebar();
                    }}
                    className="group flex min-w-0 items-center gap-2 rounded-xl px-3 py-3 text-sm text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--surface-hover) text-xs font-semibold text-(--primary) transition-colors group-hover:bg-(--primary)/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <Icon
                        size={16}
                        className="hidden shrink-0 text-(--primary) sm:block"
                      />

                      <span className="min-w-0 wrap-break-word">
                        {section.title}
                      </span>
                    </span>

                    <ChevronRight
                      size={15}
                      className="shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-auto pt-6">
              <div className="rounded-xl border border-(--border) bg-(--surface-hover) p-4">
                <div className="flex items-start gap-2">
                  <Lock
                    size={17}
                    className="mt-0.5 shrink-0 text-(--primary)"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--text)">
                      Your Privacy Matters
                    </p>

                    <p className="mt-1 text-xs leading-5 text-(--text-muted)">
                      Learn how SkillBridge collects and protects your
                      information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Document */}
          <article className="min-w-0 rounded-2xl border border-(--border) bg-(--surface) p-4 shadow-(--shadow) sm:p-6 md:p-8 xl:p-10">
          
  {/* Hero */}
            <section className="border-b border-(--border) bg-(--surface)">
              <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 md:py-16 lg:px-8">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-(--border) bg-(--surface-hover) px-3 py-2 text-xs font-medium text-(--primary) sm:mb-5 sm:px-4 sm:text-sm">
                    <ShieldCheck size={17} className="shrink-0" />
                    <span>Privacy &amp; Security</span>
                  </div>

                  <h1 className="wrap-break-word text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Privacy Policy
                  </h1>

                  <p className="mt-4 text-sm leading-7 text-(--text-muted) sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
                    Your privacy matters to SkillBridge. This policy explains
                    what information we collect, how we use it, and how we
                    protect your information while you use our platform.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-(--text-muted) sm:mt-6 sm:text-sm">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-(--primary)" />
                    <span>Last updated: September 4, 2026</span>
                  </div>
                </div>
              </div>
            </section>
            <div className="min-w-0 space-y-10 sm:space-y-12">
              <PolicySection
                id="information"
                number="01"
                title="Information We Collect"
              >
                <p>
                  When you use SkillBridge, we may collect information necessary
                  to create your account, build your professional profile,
                  evaluate challenge performance, provide messaging
                  functionality, and maintain platform security.
                </p>

                <ul className="list-disc space-y-2 pl-5 marker:text-(--primary)">
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
                  stores information associated with your account. Passwords are
                  not stored as plain text and are processed using secure
                  password hashing.
                </p>

                <p>
                  Your account may also contain a profile image, role, account
                  status, and other information required to operate the
                  platform.
                </p>
              </PolicySection>

              <PolicySection
                id="profiles"
                number="03"
                title="Developer & Recruiter Profiles"
              >
                <p>
                  Developers and recruiters may voluntarily provide professional
                  information to create their SkillBridge profiles.
                </p>

                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
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
                  SkillBridge collects information related to coding challenges,
                  project-based assessments, submissions, scores, attempts,
                  completion status, reviews, feedback, rankings, and badges.
                </p>

                <p>
                  This information is used to create a more meaningful technical
                  profile and help recruiters evaluate demonstrated skills
                  rather than relying only on resumes or certificates.
                </p>
              </PolicySection>

              <PolicySection id="messaging" number="05" title="Messaging">
                <p>
                  SkillBridge provides messaging functionality between
                  developers and recruiters. Messages, conversation metadata,
                  timestamps, read status, and edited-message information may be
                  stored to provide and maintain the messaging service.
                </p>

                <div className="rounded-xl border border-(--border) bg-(--surface-hover) p-3 sm:p-4">
                  <p className="text-sm leading-6">
                    Please do not share passwords, payment information, or other
                    highly sensitive information through SkillBridge messages.
                  </p>
                </div>
              </PolicySection>

              <PolicySection
                id="images"
                number="06"
                title="Profile Images & Third-Party Image Hosting"
              >
                <p>
                  Users may upload profile photos or company logos. Depending on
                  the implementation, uploaded images may be processed and
                  hosted through a third-party image hosting provider such as
                  ImgBB.
                </p>

                <p>
                  By uploading an image, you confirm that you have the right to
                  use and publish that image.
                </p>
              </PolicySection>

              <PolicySection
                id="usage"
                number="07"
                title="How We Use Information"
              >
                <p>We may use collected information to:</p>

                <ul className="list-disc space-y-2 pl-5 marker:text-(--primary)">
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

              <PolicySection id="security" number="08" title="Data Security">
                <p>
                  SkillBridge takes reasonable technical and organizational
                  measures to protect user information from unauthorized access,
                  modification, disclosure, or destruction.
                </p>

                <p>
                  However, no internet-based service can guarantee absolute
                  security. Users should maintain strong account credentials and
                  avoid sharing account information with others.
                </p>
              </PolicySection>

              <PolicySection id="retention" number="09" title="Data Retention">
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
                  When significant changes are made, the updated version will be
                  published on this page with a revised “Last updated” date.
                </p>
              </PolicySection>

              <PolicySection id="contact" number="11" title="Contact">
                <p>
                  If you have questions, concerns, or requests regarding this
                  Privacy Policy or your personal information, please contact
                  the SkillBridge platform administration team.
                </p>
              </PolicySection>

              {/* Footer Notice */}
              <div className="rounded-2xl border border-(--primary)/20 bg-(--primary)/5 p-4 sm:p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-(--primary)"
                    size={20}
                  />

                  <div className="min-w-0">
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
    <section id={id} className="min-w-0 scroll-mt-20">
      <div className="mb-4 flex min-w-0 items-start gap-3 sm:mb-5 sm:gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-xs font-bold text-(--primary) sm:h-9 sm:w-9">
          {number}
        </span>

        <h2 className="min-w-0 wrap-break-word pt-0.5 text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="min-w-0 space-y-4 wrap-break-word pl-0 text-sm leading-7 text-(--text-muted) sm:pl-11 sm:text-[15px] sm:leading-7">
        {children}
      </div>
    </section>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="min-w-0 rounded-xl border border-(--border) bg-(--surface-hover) p-4 sm:p-5">
      <h3 className="wrap-break-word font-semibold text-(--text)">{title}</h3>

      <ul className="mt-3 space-y-2 text-sm leading-6 text-(--text-muted)">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--primary)" />

            <span className="min-w-0 wrap-break-word">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
