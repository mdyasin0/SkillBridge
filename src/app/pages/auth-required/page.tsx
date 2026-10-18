
"use client";

import { useRouter } from "next/navigation";
import { LogIn, UserPlus, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AuthRequiredPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen flex items-center justify-center px-3 py-6 sm:px-5 sm:py-10"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="w-full max-w-lg mx-auto">
        <div
          className="w-full rounded-2xl border p-5 sm:p-8 md:p-10 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "var(--surface-hover)",
                border: "1px solid var(--border)",
              }}
            >
              <ShieldCheck
                size={36}
                strokeWidth={1.8}
                style={{ color: "var(--primary)" }}
                className="sm:hidden"
              />
              <ShieldCheck
                size={42}
                strokeWidth={1.8}
                style={{ color: "var(--primary)" }}
                className="hidden sm:block"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: "var(--surface-hover)",
                color: "var(--primary)",
                border: "1px solid var(--border)",
              }}
            >
              LOGIN REQUIRED
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight break-words"
            style={{ color: "var(--text)" }}
          >
            Authentication Required
          </h1>

          {/* Description */}
          <p
            className="text-sm sm:text-base md:text-lg leading-6 sm:leading-7 max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Sorry, you need to be logged in to access this page. Please sign
            in to your account to continue.
          </p>

          {/* Account Message */}
          <p
            className="text-sm mt-4 leading-6 max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Already have an account? Log in to continue. If you are new here,
            create an account first.
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 sm:mt-8">
            {/* Login */}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="w-full min-h-11 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-lg font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: "var(--primary)",
                color: "var(--bg-secondary)",
                outlineColor: "var(--primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
              }}
            >
              <LogIn size={18} className="shrink-0" />
              <span>Login</span>
            </button>

            {/* Register */}
            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="w-full min-h-11 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-lg border font-medium transition-colors duration-200 hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: "var(--surface)",
                color: "var(--text)",
                borderColor: "var(--border)",
                outlineColor: "var(--primary)",
              }}
            >
              <UserPlus size={18} className="shrink-0" />
              <span>Register</span>
            </button>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="min-h-11 inline-flex items-center justify-center gap-2 mt-4 sm:mt-6 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg"
            style={{
              color: "var(--text-muted)",
              outlineColor: "var(--primary)",
            }}
          >
            <ArrowLeft size={16} className="shrink-0" />
            <span>Go Back</span>
          </button>

          {/* Footer Info */}
          <div
            className="mt-6 sm:mt-7 pt-4 sm:pt-5 border-t text-xs leading-5"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <p>
              This page is available to authenticated users only.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
