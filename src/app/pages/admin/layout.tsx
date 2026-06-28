"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { name: "Dashboard", path: "/admin" },
  { name: "users_management", path: "/pages/admin/users_management" },
  { name: "Challenge_list", path: "/pages/admin/challenge_list" },
  { name: "Create_challenge", path: "/pages/admin/create_challenge" },

];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 p-4 border-r"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          {routes.map((route) => {
            const isActive =
              pathname === route.path ||
              pathname.startsWith(route.path + "/");

            return (
              <Link
                key={route.path}
                href={route.path}
                className="px-4 py-2 rounded-md transition-all"
                style={{
                  background: isActive
                    ? "var(--primary)"
                    : "transparent",
                  color: isActive ? "#fff" : "var(--text)",
                }}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Right Content */}
      <main
        className="flex-1 p-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        {children}
      </main>
    </div>
  );
}