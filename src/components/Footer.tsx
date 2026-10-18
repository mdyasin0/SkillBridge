
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-(--border) bg-(--bg-secondary) text-(--text-muted)">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-(--text)">
              Skill<span className="text-(--primary)">Bridge</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-(--text-muted)">
              A skill verification platform that helps developers prove
              real-world abilities through challenges, analytics, and
              performance-based scoring.
            </p>
          </div>

          {/* Company */}
          <div className="min-w-0">
            <h3 className="mb-4 font-semibold text-(--text)">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="break-words transition-colors duration-200 hover:text-(--text)"
                >
                  Docs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-(--border) pt-6 sm:mt-10 sm:gap-4 md:mt-12 md:flex-row md:items-center">
          <p className="text-sm leading-relaxed text-(--text-muted)">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm sm:gap-x-6">
            <Link
              href="/pages/PrivacyPolicy"
              className="break-words transition-colors duration-200 hover:text-(--text)"
            >
              Privacy Policy
            </Link>

            <Link
              href="/pages/TermsAndConditions"
              className="break-words transition-colors duration-200 hover:text-(--text)"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
