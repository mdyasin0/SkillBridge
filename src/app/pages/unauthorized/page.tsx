
"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen min-w-0 items-center justify-center overflow-x-clip bg-(--bg) px-4 py-8 text-(--text) sm:px-6 sm:py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 text-center shadow-(--shadow) sm:p-8 md:p-10">
          {/* Warning Icon */}
          <div className="mb-5 flex justify-center sm:mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-(--border) bg-(--surface-hover) sm:h-20 sm:w-20">
              <ShieldAlert
                size={36}
                strokeWidth={1.8}
                className="text-(--primary) sm:hidden"
              />

              <ShieldAlert
                size={42}
                strokeWidth={1.8}
                className="hidden text-(--primary) sm:block"
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-4 flex justify-center">
            <span className="inline-flex max-w-full items-center rounded-full border border-(--border) bg-(--surface-hover) px-3 py-1.5 text-xs font-semibold tracking-wide text-(--primary)">
              ACCESS RESTRICTED
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-3 break-words text-2xl font-bold tracking-tight text-(--text) sm:mb-4 sm:text-3xl md:text-4xl">
            Access Denied
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-md break-words text-sm leading-6 text-(--text-muted) sm:text-base sm:leading-7 md:text-lg">
            Sorry, you do not have permission to access this page. Your
            account does not have the required access level for this section.
          </p>

          {/* Additional Message */}
          <p className="mx-auto mt-4 max-w-md break-words text-sm leading-6 text-(--text-muted)">
            If you believe this is a mistake, please make sure you are signed
            in with the correct account or contact the administrator.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
            {/* Go Back */}
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--surface) px-5 py-3 text-sm font-medium text-(--text) transition-colors hover:bg-(--surface-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) active:opacity-80 sm:w-auto"
            >
              <ArrowLeft size={18} className="shrink-0" />
              <span>Go Back</span>
            </button>

            {/* Go Home */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-5 py-3 text-sm font-medium text-(--primary-foreground) transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) active:opacity-75 sm:w-auto"
            >
              <Home size={18} className="shrink-0" />
              <span>Go to Home</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-7 border-t border-(--border) pt-5 text-xs leading-5 text-(--text-muted) sm:mt-8 sm:pt-6">
            <p>
              Error Code:{" "}
              <span className="font-semibold text-(--text)">403</span>
            </p>

            <p className="mt-1">
              You are not authorized to view this page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
