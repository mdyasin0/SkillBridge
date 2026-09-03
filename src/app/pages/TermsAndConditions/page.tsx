"use client";

import {
  FileText,
  UserRound,
  ShieldCheck,
  Code2,
  Award,
  MessageSquare,
  Ban,
  AlertTriangle,
  Scale,
  RefreshCw,
  Mail,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "about", title: "About SkillBridge", icon: FileText },
  { id: "accounts", title: "User Accounts", icon: UserRound },
  { id: "roles", title: "User Roles", icon: ShieldCheck },
  { id: "profiles", title: "Profiles", icon: UserRound },
  { id: "challenges", title: "Challenges", icon: Code2 },
  { id: "scoring", title: "Attempts & Scoring", icon: Award },
  { id: "ranking", title: "Ranking & Badges", icon: Award },
  { id: "recruiters", title: "Recruiter Use", icon: UserRound },
  { id: "messaging", title: "Messaging", icon: MessageSquare },
  { id: "prohibited", title: "Prohibited Activities", icon: Ban },
  { id: "termination", title: "Suspension & Termination", icon: AlertTriangle },
  { id: "availability", title: "Platform Availability", icon: RefreshCw },
  { id: "liability", title: "Limitation of Liability", icon: Scale },
  { id: "changes", title: "Changes", icon: RefreshCw },
  { id: "contact", title: "Contact", icon: Mail },
];

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      {/* Hero */}
      <section className="border-b border-(--border) bg-(--surface)">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface-hover) px-4 py-2 text-sm font-medium text-(--primary)">
              <FileText size={17} />
              Legal Agreement
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 text-lg leading-8 text-(--text-muted)">
              These Terms & Conditions define the rules and responsibilities
              that apply when using SkillBridge, including accounts, profiles,
              challenges, communication, rankings, and platform usage.
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

          {/* Document */}
          <article className="min-w-0 rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow) sm:p-8 lg:p-10">
            <div className="space-y-12">
              <TermsSection id="about" number="01" title="About SkillBridge">
                <p>
                  SkillBridge is a technology platform designed to connect
                  demonstrated technical skills with professional opportunities.
                </p>

                <p>
                  The platform allows developers to demonstrate their abilities
                  through coding challenges, project-based assessments,
                  performance tracking, rankings, badges, and reviewer feedback.
                </p>

                <p>
                  Recruiters can use these technical profiles to discover and
                  evaluate developers based on demonstrated performance.
                </p>
              </TermsSection>

              <TermsSection id="accounts" number="02" title="User Accounts">
                <p>
                  You are responsible for providing accurate information when
                  creating your SkillBridge account.
                </p>

                <ul>
                  <li>You must keep your login credentials confidential.</li>
                  <li>You must not share your account with another person.</li>
                  <li>
                    You are responsible for activities performed through your
                    account.
                  </li>
                  <li>
                    You should immediately report unauthorized account access.
                  </li>
                </ul>
              </TermsSection>

              <TermsSection id="roles" number="03" title="User Roles">
                <p>
                  SkillBridge currently supports different platform roles,
                  including:
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <RoleCard
                    title="Developer"
                    description="Demonstrates technical skills through challenges and maintains a professional technical profile."
                  />

                  <RoleCard
                    title="Recruiter"
                    description="Searches for developers, evaluates profiles, and communicates with potential candidates."
                  />

                  <RoleCard
                    title="Administrator"
                    description="Manages users, challenges, reviews, moderation, and platform operations."
                  />
                </div>
              </TermsSection>

              <TermsSection id="profiles" number="04" title="Profiles">
                <p>
                  Users may create professional profiles containing information
                  such as skills, experience, education, technologies,
                  portfolios, social links, company information, and profile
                  images.
                </p>

                <p>
                  You are responsible for ensuring that information submitted to
                  your profile is accurate and that you have the right to
                  publish it.
                </p>

                <div className="rounded-xl border border-(--border) bg-(--surface-hover) p-4">
                  <p className="text-sm">
                    SkillBridge may restrict, suspend, or remove profiles that
                    contain misleading, fraudulent, abusive, or prohibited
                    information.
                  </p>
                </div>
              </TermsSection>

              <TermsSection
                id="challenges"
                number="05"
                title="Developer Challenges"
              >
                <p>
                  SkillBridge may provide coding challenges, technology-based
                  assessments, and project-based challenges.
                </p>

                <p>
                  Challenge requirements may include a time limit, maximum
                  attempts, submission requirements, technology restrictions,
                  and review criteria.
                </p>

                <ul>
                  <li>
                    Challenges must be completed according to their rules.
                  </li>
                  <li>
                    Users must submit their own work unless collaboration is
                    explicitly permitted.
                  </li>
                  <li>
                    Attempts may be tracked and associated with the user&apos;s
                    profile.
                  </li>
                  <li>
                    Expired challenges may be automatically submitted according
                    to challenge rules.
                  </li>
                </ul>
              </TermsSection>

              <TermsSection
                id="scoring"
                number="06"
                title="Attempts, Review & Scoring"
              >
                <p>
                  Challenge submissions may be reviewed by authorized
                  administrators or reviewers. Scores and feedback are intended
                  to reflect the quality and correctness of submitted work.
                </p>

                <div className="rounded-2xl border border-(--primary)/20 bg-(--primary)/5 p-5">
                  <h3 className="font-semibold text-(--text)">
                    Attempt Penalty
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-(--text-muted)">
                    There is no penalty for the first attempt. Based on the
                    original score out of 100, 5% is deducted for each
                    additional attempt after the first attempt.
                  </p>
                </div>

                <p>
                  Challenge difficulty may also be considered separately by
                  SkillBridge&apos;s ranking and skill evaluation systems.
                </p>
              </TermsSection>

              <TermsSection
                id="ranking"
                number="07"
                title="Ranking & Badge System"
              >
                <p>
                  SkillBridge may calculate developer rankings using multiple
                  performance indicators, including approved challenges, average
                  scores, and difficulty-based completion.
                </p>

                <p>
                  Badges may be awarded based on challenge performance and
                  platform-defined achievement criteria.
                </p>

                <p>
                  Rankings and badges are platform-generated indicators and
                  should not be interpreted as an absolute measurement of a
                  person&apos;s complete professional ability.
                </p>
              </TermsSection>

              <TermsSection id="recruiters" number="08" title="Recruiter Use">
                <p>
                  Recruiters may search and review developer profiles to
                  identify potential candidates.
                </p>

                <ul>
                  <li>
                    Recruiters must use developer information for legitimate
                    professional purposes.
                  </li>
                  <li>
                    Recruiters must not misuse, copy, sell, or redistribute
                    private platform information.
                  </li>
                  <li>
                    Recruiters are responsible for complying with applicable
                    employment and privacy requirements.
                  </li>
                </ul>
              </TermsSection>

              <TermsSection
                id="messaging"
                number="09"
                title="Messaging & Communication"
              >
                <p>
                  SkillBridge provides communication features between developers
                  and recruiters.
                </p>

                <p>
                  Users must communicate respectfully and must not use messaging
                  features for harassment, spam, scams, threats, discrimination,
                  or other abusive activities.
                </p>
              </TermsSection>

              <TermsSection
                id="prohibited"
                number="10"
                title="Prohibited Activities"
              >
                <p>You must not use SkillBridge to:</p>

                <ul>
                  <li>Impersonate another person or organization</li>
                  <li>Submit fraudulent or plagiarized work</li>
                  <li>Manipulate rankings, scores, or badges</li>
                  <li>Attempt unauthorized access to platform systems</li>
                  <li>Upload malicious code or harmful content</li>
                  <li>Harass, threaten, or abuse other users</li>
                  <li>Send spam or fraudulent communications</li>
                  <li>Scrape or misuse platform data</li>
                  <li>Interfere with platform operation or security</li>
                </ul>
              </TermsSection>

              <TermsSection
                id="termination"
                number="11"
                title="Suspension & Termination"
              >
                <p>
                  SkillBridge may suspend, restrict, or terminate accounts that
                  violate these Terms, compromise platform security, engage in
                  fraudulent activity, or otherwise misuse the service.
                </p>

                <p>
                  Depending on the situation, administrators may also ban,
                  suspend, restore, or remove user accounts.
                </p>
              </TermsSection>

              <TermsSection
                id="availability"
                number="12"
                title="Platform Availability"
              >
                <p>
                  SkillBridge aims to provide a reliable service but does not
                  guarantee that the platform will always be available,
                  uninterrupted, or error-free.
                </p>

                <p>
                  Maintenance, technical problems, security incidents,
                  infrastructure failures, or third-party service issues may
                  temporarily affect availability.
                </p>
              </TermsSection>

              <TermsSection
                id="liability"
                number="13"
                title="Employment Disclaimer"
              >
                <p>
                  SkillBridge provides tools for technical evaluation and
                  professional discovery. A developer&apos;s ranking, badge, score,
                  or profile does not guarantee employment.
                </p>

                <p>
                  Recruiters are responsible for their own hiring decisions,
                  interviews, employment practices, and candidate evaluation.
                </p>
              </TermsSection>

              <TermsSection
                id="changes"
                number="14"
                title="Changes to These Terms"
              >
                <p>
                  SkillBridge may modify these Terms & Conditions as the
                  platform evolves or as legal, security, and operational
                  requirements change.
                </p>

                <p>
                  Updated terms will be published on this page together with a
                  revised “Last updated” date.
                </p>
              </TermsSection>

              <TermsSection id="contact" number="15" title="Contact">
                <p>
                  If you have questions regarding these Terms & Conditions,
                  please contact the SkillBridge platform administration team.
                </p>
              </TermsSection>

              {/* Acceptance */}
              <div className="rounded-2xl border border-(--primary)/20 bg-(--primary)/5 p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-(--primary)"
                    size={20}
                  />

                  <div>
                    <h3 className="font-semibold">Acceptance of These Terms</h3>

                    <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                      By creating an account or using SkillBridge, you
                      acknowledge that you have read, understood, and agreed to
                      these Terms & Conditions.
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

function TermsSection({
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

function RoleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface-hover) p-5 transition hover:-translate-y-0.5 hover:shadow-(--shadow)">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
        <UserRound size={18} />
      </div>

      <h3 className="font-semibold text-(--text)">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-(--text-muted)">
        {description}
      </p>
    </div>
  );
}
