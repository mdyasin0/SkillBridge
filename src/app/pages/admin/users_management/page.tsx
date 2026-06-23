"use client";

import { useEffect, useState } from "react";
import { MdDeveloperMode, MdManageAccounts } from "react-icons/md";
import { toast } from "react-toastify";

type User = {
  created_at: string | number | Date;
  id: number;
  name: string;
  email: string;
  role: "developer" | "recruiter";
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
    fetch("/api/all_users_get")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
        setFiltered(data.data);
      });
  }, []);
  const totalDevelopers = users.filter((u) => u.role === "developer").length;

  const totalRecruiters = users.filter((u) => u.role === "recruiter").length;
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
    const base = "px-2 py-1 text-xs rounded-full font-medium";

    switch (status) {
      case "active":
        return `${base} bg-green-100 text-green-700`;

      case "suspended":
        return `${base} bg-yellow-100 text-yellow-700`;

      case "banned":
        return `${base} bg-red-100 text-red-700`;

      default:
        return base;
    }
  };
  const handleAction = async (id: number, action: string) => {
    try {
      const res = await fetch(`/api/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      //  ERROR CASE
      if (!res.ok) {
        toast.error(data.message || "Something went wrong ");
        return;
      }

      //  SUCCESS ALERT
      toast.success(data.message || "Action successful ");

      //  DELETE CASE
      if (action === "delete") {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setFiltered((prev) => prev.filter((u) => u.id !== id));
        return;
      }

      //  STATUS UPDATE CASE
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
      console.error(error);
    }
  };
  return (
    <div className="p-6 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Developers */}
        <div className="p-4 rounded-lg border bg-(--surface) shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500">Total Developers</p>
            <h2 className="text-2xl font-bold">{totalDevelopers}</h2>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
           <MdDeveloperMode />
          </div>
        </div>

        {/* Recruiters */}
        <div className="p-4 rounded-lg border bg-(--surface) shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500">Total Recruiters</p>
            <h2 className="text-2xl font-bold">{totalRecruiters}</h2>
          </div>

          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
         <MdManageAccounts />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search name or email..."
          className="border px-3 py-2 rounded bg-(--surface) focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded bg-(--surface) cursor-pointer"
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="developer">Developer</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <input
          type="number"
          placeholder="Time"
          className="border px-3 py-2 rounded w-24 bg-(--surface)"
          onChange={(e) => setTimeValue(Number(e.target.value))}
        />

        <select
          className="border px-3 py-2 rounded bg-(--surface) cursor-pointer"
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
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-(--surface-hover) text-gray-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-(--surface-hover) transition"
              >
                <td className="p-3 font-medium">{user.name}</td>

                <td className="p-3 max-w-50 truncate">{user.email}</td>

                <td className="p-3 text-center capitalize">{user.role}</td>

                <td className="p-3 text-center">
                  <span className={getStatusBadge(user.status)}>
                    {user.status}
                  </span>
                </td>

                <td className="p-3 text-center">
                  {new Date(user.created_at).toLocaleString()}
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      className={`px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-600 active:scale-95 transition cursor-pointer ${
                        activeAction === user.id && "opacity-70"
                      }`}
                      onClick={() => handleAction(user.id, "ban")}
                    >
                      Ban
                    </button>

                    <button
                      className="px-2 py-1 rounded text-xs bg-yellow-500 text-white hover:bg-yellow-600 active:scale-95 transition cursor-pointer"
                      onClick={() => handleAction(user.id, "suspend")}
                    >
                      Suspend
                    </button>

                    <button
                      className="px-2 py-1 rounded text-xs bg-green-500 text-white hover:bg-green-600 active:scale-95 transition cursor-pointer"
                      onClick={() => handleAction(user.id, "restore")}
                    >
                      Restore
                    </button>

                    <button
                      className="px-2 py-1 rounded text-xs bg-gray-600 text-white hover:bg-gray-700 active:scale-95 transition cursor-pointer"
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
