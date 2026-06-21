import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-(--border) bg-(--bg-secondary) text-(--text-muted)">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-(--text) text-lg font-bold">
              Skill<span className="text-(--primary)">Bridge</span>
            </h2>

            <p className="mt-3 text-sm text-(--text-muted) leading-relaxed">
              A skill verification platform that helps developers prove
              real-world abilities through challenges, analytics, and
              performance-based scoring.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-(--text) font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/explore"
                  className="hover:text-(--text) transition"
                >
                  Explore Challenges
                </Link>
              </li>
              <li>
                <Link
                  href="/challenges"
                  className="hover:text-(--text) transition"
                >
                  All Challenges
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-(--text) transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-(--text) transition"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-(--text) font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-(--text) transition"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-(--text) transition">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-(--text) transition">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-(--text) transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiter */}
          <div>
            <h3 className="text-(--text) font-semibold mb-4">For Recruiters</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/recruiter/dashboard"
                  className="hover:text-(--text) transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/recruiter/candidates"
                  className="hover:text-(--text) transition"
                >
                  Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/recruiter/ranking"
                  className="hover:text-(--text) transition"
                >
                  Talent Ranking
                </Link>
              </li>
              <li>
                <Link
                  href="/recruiter/create-challenge"
                  className="hover:text-(--text)] transition"
                >
                  Create Challenge
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-(--border) flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-(--text-muted)">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-(--text) transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-(--text) transition">
              Terms
            </Link>
            <Link href="/security" className="hover:text-(--text) transition">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
