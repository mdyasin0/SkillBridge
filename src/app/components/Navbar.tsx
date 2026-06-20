"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 border-b border-(--border) bg-(--bg-secondary)/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-(--text)">
          Skill<span className="text-(--primary)">Bridge</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-(--text-muted)">
          <Link href="/" className="hover:text-(--text) transition">
            Home
          </Link>

          <Link href="/explore" className="hover:text-(--text) transition">
            Explore
          </Link>

          <Link href="/challenges" className="hover:text-(--text) transition">
            Challenges
          </Link>

          <Link href="/how-it-works" className="hover:text-(--text) transition">
            How it Works
          </Link>

          <Link href="/docs" className="hover:text-(--text) transition">
            Docs
          </Link>

          <div className="w-px h-5 bg-(--border) mx-2" />

          <Link href="/dashboard" className="hover:text-(--text) transition">
            Dashboard
          </Link>

          <Link
            href="/recruiter/dashboard"
            className="hover:text-(--text) transition"
          >
            Recruiter
          </Link>

          <Link
            href="/admin/dashboard"
            className="hover:text-(--text) transition"
          >
            Admin
          </Link>
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-(--text-muted) hover:text-(--text) transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-md bg-(--primary) hover:bg-(--primary-hover) text-white text-sm transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-(--text) text-xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-(--text-muted) bg-(--bg-secondary) border-t border-(--border)">
          <Link href="/" className="block hover:text-(--text) transition">
            Home
          </Link>

          <Link
            href="/explore"
            className="block hover:text-(--text) transition"
          >
            Explore
          </Link>

          <Link
            href="/challenges"
            className="block hover:text-(--text) transition"
          >
            Challenges
          </Link>

          <Link
            href="/how-it-works"
            className="block hover:text-(--text) transition"
          >
            How it Works
          </Link>

          <Link href="/docs" className="block hover:text-(--text) transition">
            Docs
          </Link>

          <hr className="border-(--border)" />

          <Link
            href="/dashboard"
            className="block hover:text-(--text) transition"
          >
            Dashboard
          </Link>

          <Link
            href="/recruiter/dashboard"
            className="block hover:text-(--text) transition"
          >
            Recruiter
          </Link>

          <Link
            href="/admin/dashboard"
            className="block hover:text-(--text) transition"
          >
            Admin
          </Link>

          <hr className="border-(--border)" />

          <Link href="/login" className="block hover:text-(--text) transition">
            Login
          </Link>

          <Link href="/register" className="block text-(--primary) font-medium">
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
