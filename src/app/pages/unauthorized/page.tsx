
"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
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
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "var(--surface-hover)",
                border: "1px solid var(--border)",
              }}
            >
              <ShieldAlert
                size={42}
                strokeWidth={1.8}
                style={{ color: "var(--primary)" }}
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: "var(--surface-hover)",
                color: "var(--primary)",
                border: "1px solid var(--border)",
              }}
            >
              ACCESS RESTRICTED
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Access Denied
          </h1>

          {/* Description */}
          <p
            className="text-base sm:text-lg leading-7 max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Sorry, you do not have permission to access this page. Your
            account does not have the required access level for this section.
          </p>

          {/* Additional Message */}
          <p
            className="text-sm mt-4 leading-6 max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            If you believe this is a mistake, please make sure you are signed
            in with the correct account or contact the administrator.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            {/* Go Back */}
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-all duration-200 hover:opacity-80"
              style={{
                color: "var(--text)",
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            {/* Go Home */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200"
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
              <Home size={18} />
              Go to Home
            </button>
          </div>

          {/* Help Text */}
          <div
            className="mt-8 pt-6 border-t text-xs"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <p>
              Error Code:{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--text)" }}
              >
                403
              </span>
            </p>
            <p className="mt-1">You are not authorized to view this page.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

