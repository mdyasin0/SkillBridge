
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

  // Close dropdown on outside click
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

  // Close mobile menu after navigation
  const closeMobileMenu = () => {
    setOpen(false);
    setDropdown(false);
  };

  const dashboardLink =
    isLoggedIn && user?.role === "recruiter"
      ? { href: "/pages/recruiter", label: "Recruiter" }
      : isLoggedIn && user?.role === "developer"
        ? { href: "/pages/developer", label: "Developer" }
        : isLoggedIn && user?.role === "admin"
          ? { href: "/pages/admin", label: "Admin" }
          : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--bg-secondary)/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="shrink-0 text-lg font-bold text-(--text) sm:text-xl"
        >
          Skill<span className="text-(--primary)">Bridge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 text-sm text-(--text-muted) md:flex xl:gap-6">
          <Link
            href="/"
            className="transition-colors hover:text-(--primary)"
          >
            Home
          </Link>

          {dashboardLink && (
            <Link
              href={dashboardLink.href}
              className="transition-colors hover:text-(--primary)"
            >
              {dashboardLink.label}
            </Link>
          )}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          {loading ? (
            <span className="text-sm text-(--text-muted)">Loading...</span>
          ) : isLoggedIn && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdown(!dropdown)}
                aria-label="Open profile menu"
                aria-expanded={dropdown}
                className="flex items-center gap-2 rounded-full border border-(--border) p-1 transition-colors hover:bg-(--surface-hover)"
              >
                <Image
                  src={user.image || "/avatar.png"}
                  alt="user"
                  width={36}
                  height={36}
                  className="rounded-full border border-(--border) object-cover"
                />
              </button>

              {dropdown && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border border-(--border) bg-(--surface) p-4 text-(--text) shadow-lg">
                  {/* User Info */}
                  <div className="mb-3 flex min-w-0 items-center gap-3">
                    <Image
                      src={user.image || "/avatar.png"}
                      alt="user"
                      width={40}
                      height={40}
                      className="shrink-0 rounded-full border border-(--border) object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-(--text)">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-(--text-muted)">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <p className="mb-3 text-xs text-(--text-muted)">
                    Role:{" "}
                    <span className="font-medium text-(--text)">
                      {user.role}
                    </span>
                  </p>

                  <div className="my-2 border-t border-(--border)" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-(--primary) transition-colors hover:bg-(--surface-hover)"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-(--text-muted) transition-colors hover:text-(--primary)"
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--primary-hover)"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Compact Navigation Toggle: Mobile, Tablet and Small Laptop */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-(--border) text-xl text-(--text) transition-colors hover:bg-(--surface-hover) md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Compact Navigation Menu */}
      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-(--border) bg-(--bg-secondary) px-3 pb-5 pt-3 sm:px-4 md:hidden">
          <nav className="flex flex-col gap-1 text-sm text-(--text-muted)">
            {/* Home */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-3 py-3 transition-colors hover:bg-(--surface-hover) hover:text-(--primary)"
            >
              Home
            </Link>

            {/* Role-specific Dashboard */}
            {dashboardLink && (
              <Link
                href={dashboardLink.href}
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 transition-colors hover:bg-(--surface-hover) hover:text-(--primary)"
              >
                {dashboardLink.label}
              </Link>
            )}

            <div className="my-2 border-t border-(--border)" />

            {/* Authentication / Profile */}
            {loading ? (
              <div className="px-3 py-3 text-(--text-muted)">
                Loading...
              </div>
            ) : isLoggedIn && user ? (
              <>
                {/* User Info */}
                <div className="flex min-w-0 items-center gap-3 rounded-lg bg-(--surface-hover) p-3">
                  <Image
                    src={user.image || "/avatar.png"}
                    alt="user"
                    width={44}
                    height={44}
                    className="shrink-0 rounded-full border border-(--border) object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--text)">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-(--text-muted)">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs text-(--text-muted)">
                      Role:{" "}
                      <span className="font-medium text-(--text)">
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setDropdown(false);
                    signOut({ callbackUrl: "/auth/login" });
                  }}
                  className="mt-2 w-full rounded-lg px-3 py-3 text-left text-sm text-(--primary) transition-colors hover:bg-(--surface-hover)"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-3 transition-colors hover:bg-(--surface-hover) hover:text-(--primary)"
                >
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-(--primary) px-3 py-3 text-center font-medium text-white transition-colors hover:bg-(--primary-hover)"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
