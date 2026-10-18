
"use client";

import { useEffect, useState } from "react";
import {
  MdDeveloperMode,
  MdManageAccounts,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { toast } from "react-toastify";

type User = {
  created_at: string | number | Date;
  id: number;
  name: string;
  email: string;
  role: "developer" | "recruiter" | "admin";
  status: "active" | "suspended" | "banned";
  createdAt: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [timeValue, setTimeValue] = useState(0);
  const [timeUnit, setTimeUnit] = useState("days");

  const [activeAction, setActiveAction] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/usermanage/all_users_get")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
        setFiltered(data.data);
      });
  }, []);

  const totalDevelopers = users.filter(
    (u) => u.role === "developer",
  ).length;

  const totalRecruiters = users.filter(
    (u) => u.role === "recruiter",
  ).length;

  const totaladmins = users.filter(
    (u) => u.role === "admin",
  ).length;

  useEffect(() => {
    let data = [...users];

    if (search) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (roleFilter !== "all") {
      data = data.filter((u) => u.role === roleFilter);
    }

    if (timeValue > 0) {
      const now = new Date();

      data = data.filter((u) => {
        const created = new Date(u.createdAt);
        const diffMs = now.getTime() - created.getTime();

        let limit = 0;

        switch (timeUnit) {
          case "hours":
            limit = timeValue * 60 * 60 * 1000;
            break;
          case "days":
            limit = timeValue * 24 * 60 * 60 * 1000;
            break;
          case "weeks":
            limit = timeValue * 7 * 24 * 60 * 60 * 1000;
            break;
          case "months":
            limit = timeValue * 30 * 24 * 60 * 60 * 1000;
            break;
          case "years":
            limit = timeValue * 365 * 24 * 60 * 60 * 1000;
            break;
        }

        return diffMs <= limit;
      });
    }

    setFiltered(data);
  }, [search, roleFilter, timeValue, timeUnit, users]);

  const getStatusBadge = (status: User["status"]): string => {
    const base =
      "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium";

    switch (status) {
      case "active":
        return `${base} border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400`;

      case "suspended":
        return `${base} border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400`;

      case "banned":
        return `${base} border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400`;

      default:
        return base;
    }
  };

  const handleAction = async (id: number, action: string) => {
    try {
      const res = await fetch(`/api/usermanage/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      // ERROR CASE
      if (!res.ok) {
        toast.error(data.message || "Something went wrong ");
        return;
      }

      // SUCCESS ALERT
      toast.success(data.message || "Action successful ");

      // DELETE CASE
      if (action === "delete") {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setFiltered((prev) => prev.filter((u) => u.id !== id));
        return;
      }

      // STATUS UPDATE CASE
      const newStatus =
        action === "ban"
          ? "banned"
          : action === "suspend"
            ? "suspended"
            : action === "restore"
              ? "active"
              : null;

      if (!newStatus) return;

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
      );

      setFiltered((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
      );
    } catch (error) {
      toast.error("Server error ");
      toast.error(String(error));
    }
  };

  return (
    <div className="w-full min-w-0 space-y-4 p-3 sm:p-4 md:p-6">
      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        {/* Developers */}
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--surface) p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="min-w-0">
            <p className="text-sm text-(--text-muted)">
              Total Developers
            </p>
            <h2 className="mt-1 text-2xl font-bold text-(--text)">
              {totalDevelopers}
            </h2>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--primary)/20 bg-(--primary)/10 text-(--primary)">
            <MdDeveloperMode size={24} />
          </div>
        </div>

        {/* Recruiters */}
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--surface) p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="min-w-0">
            <p className="text-sm text-(--text-muted)">
              Total Recruiters
            </p>
            <h2 className="mt-1 text-2xl font-bold text-(--text)">
              {totalRecruiters}
            </h2>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--primary)/20 bg-(--primary)/10 text-(--primary)">
            <MdManageAccounts size={24} />
          </div>
        </div>

        {/* Admins */}
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--surface) p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <div className="min-w-0">
            <p className="text-sm text-(--text-muted)">
              Total Admins
            </p>
            <h2 className="mt-1 text-2xl font-bold text-(--text)">
              {totaladmins}
            </h2>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--primary)/20 bg-(--primary)/10 text-(--primary)">
            <MdOutlineAdminPanelSettings size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          placeholder="Search name or email..."
          className="w-full min-w-0 rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full min-w-0 cursor-pointer rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="developer">Developer</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="number"
          placeholder="Time"
          className="w-full min-w-0 rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
          onChange={(e) => setTimeValue(Number(e.target.value))}
        />

        {/* For finding users based on registered time */}
        <select
          className="w-full min-w-0 cursor-pointer rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
          onChange={(e) => setTimeUnit(e.target.value)}
        >
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>

      {/* Table */}
      <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-(--border) bg-(--surface) shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm text-(--text)">
          <thead className="bg-(--surface-hover) text-(--text-muted)">
            <tr>
              <th className="whitespace-nowrap p-3 font-semibold sm:p-4">
                Name
              </th>
              <th className="whitespace-nowrap p-3 font-semibold sm:p-4">
                Email
              </th>
              <th className="whitespace-nowrap p-3 text-center font-semibold sm:p-4">
                Role
              </th>
              <th className="whitespace-nowrap p-3 text-center font-semibold sm:p-4">
                Status
              </th>
              <th className="whitespace-nowrap p-3 text-center font-semibold sm:p-4">
                Created
              </th>
              <th className="whitespace-nowrap p-3 text-center font-semibold sm:p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-t border-(--border) transition-colors hover:bg-(--surface-hover)"
              >
                <td className="max-w-56 p-3 font-medium sm:p-4">
                  <span className="block truncate">{user.name}</span>
                </td>

                <td className="max-w-64 p-3 sm:p-4">
                  <span className="block truncate text-(--text-muted)">
                    {user.email}
                  </span>
                </td>

                <td className="p-3 text-center capitalize sm:p-4">
                  {user.role}
                </td>

                <td className="p-3 text-center sm:p-4">
                  <span className={getStatusBadge(user.status)}>
                    {user.status}
                  </span>
                </td>

                <td className="whitespace-nowrap p-3 text-center text-(--text-muted) sm:p-4">
                  {new Date(user.created_at).toLocaleString()}
                </td>

                <td className="p-3 sm:p-4">
                  <div className="flex min-w-max flex-wrap justify-center gap-2">
                    <button
                      className={`cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-500/20 active:scale-95 dark:text-red-400 ${
                        activeAction === user.id ? "opacity-70" : ""
                      }`}
                      onClick={() => handleAction(user.id, "ban")}
                    >
                      Ban
                    </button>

                    <button
                      className="cursor-pointer rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-500/20 active:scale-95 dark:text-amber-400"
                      onClick={() => handleAction(user.id, "suspend")}
                    >
                      Suspend
                    </button>

                    <button
                      className="cursor-pointer rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-500/20 active:scale-95 dark:text-green-400"
                      onClick={() => handleAction(user.id, "restore")}
                    >
                      Restore
                    </button>

                    <button
                      className="cursor-pointer rounded-lg border border-(--border) bg-(--surface-hover) px-3 py-1.5 text-xs font-medium text-(--text) transition hover:opacity-80 active:scale-95"
                      onClick={() => handleAction(user.id, "delete")}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
