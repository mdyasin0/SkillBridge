"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const { user, isLoggedIn, loading } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 border-b border-(--border) bg-(--bg-secondary)/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-(--text)">
          Skill<span className="text-(--primary)">Bridge</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-(--text-muted)">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/how-it-works">How it Works</Link>
          <Link href="/docs">Docs</Link>

          <div className="w-px h-5 bg-(--border) mx-2" />

          <Link href="/dashboard">Dashboard</Link>
          <Link href="/recruiter/dashboard">Recruiter</Link>
          
           <Link href="/pages/developer">Developer</Link>
          <Link href="/pages/admin">Admin</Link>
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : isLoggedIn && user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2"
              >
                <Image
                  src={user.image || "/avatar.png"}
                  alt="user"
                  width={36}
                  height={36}
                  className="rounded-full border"
                />
              </button>

              {/* Dropdown */}
              {dropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-xl border p-4 z-50">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={user.image || "/avatar.png"}
                      alt="user"
                      width={36}
                      height={36}
                      className="rounded-full border"
                    />

                    <div>
                      <p className="font-semibold text-sm text-black">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <p className="text-xs mb-3 text-gray-600">
                    Role: <span className="font-medium">{user.role}</span>
                  </p>

                  <hr className="my-2" />

                  {/* Logout */}
                  <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="w-full text-left text-red-500 text-sm py-2 hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>

              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-md bg-(--primary) text-white"
              >
                Get Started
              </Link>
            </>
          )}
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
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/how-it-works">How it Works</Link>
          <Link href="/docs">Docs</Link>

          <hr />

          <Link href="/dashboard">Dashboard</Link>
          <Link href="/recruiter/dashboard">Recruiter</Link>
          <Link href="/admin/dashboard">Admin</Link>

          <hr />

          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register" className="text-(--primary)">
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
