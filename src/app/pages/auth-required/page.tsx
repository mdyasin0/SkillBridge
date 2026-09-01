
"use client";

import { useRouter } from "next/navigation";
import { LogIn, UserPlus, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AuthRequiredPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-lg">
        <div
          className="rounded-2xl border p-8 sm:p-10 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "var(--surface-hover)",
                border: "1px solid var(--border)",
              }}
            >
              <ShieldCheck
                size={42}
                strokeWidth={1.8}
                style={{ color: "var(--primary)" }}
              />
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
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
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Authentication Required
          </h1>

          {/* Description */}
          <p
            className="text-base sm:text-lg leading-7 max-w-md mx-auto"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
            {/* Login */}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                background: "var(--primary)",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
              }}
            >
              <LogIn size={18} />
              Login
            </button>

            {/* Register */}
            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border font-medium transition-all duration-200 hover:opacity-80"
              style={{
                background: "var(--surface)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            >
              <UserPlus size={18} />
              Register
            </button>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 mt-6 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          {/* Footer Info */}
          <div
            className="mt-7 pt-5 border-t text-xs"
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

