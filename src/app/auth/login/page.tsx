
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error while typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    // SUCCESS SWEET ALERT
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back to SkillBridge ",
      confirmButtonColor: "#5B6CFF",
    });

    // redirect after alert
    router.push("/");
  };

  return (
    <div
      className="flex min-h-screen min-h-[100dvh] w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div
        className="w-full max-w-md rounded-xl p-5 sm:p-7 md:p-8"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Title */}
        <h1 className="mb-1 text-2xl font-bold sm:text-3xl">
          Welcome Back
        </h1>

        <p
          className="mb-5 text-sm leading-relaxed sm:text-base"
          style={{ color: "var(--text-muted)" }}
        >
          Login to continue your SkillBridge journey
        </p>

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mb-1 w-full min-w-0 rounded-lg p-3 text-sm outline-none transition-colors sm:text-base"
          style={{
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--text)",
          }}
          onChange={handleChange}
        />

        {errors.email && (
          <p
            className="mb-3 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {errors.email}
          </p>
        )}

        {/* Password */}
        <div className="relative mb-1">
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="w-full min-w-0 rounded-lg p-3 pr-16 text-sm outline-none transition-colors sm:text-base"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              color: "var(--text)",
            }}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 py-1 text-sm font-medium transition-colors"
            style={{ color: "var(--primary)" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p
            className="mb-3 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {errors.password}
          </p>
        )}

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          className="mb-3 mt-3 w-full rounded-lg p-3 font-medium transition-colors hover:opacity-90 active:opacity-80"
          style={{
            background: "var(--primary)",
            color: "#FFFFFF",
          }}
        >
          Login
        </button>

        {/* Register Link */}
        <p
          className="mt-4 text-center text-sm leading-relaxed sm:text-base"
          style={{ color: "var(--text-muted)" }}
        >
          You have no account?{" "}
          <Link
            href="/auth/register"
            style={{ color: "var(--primary)" }}
            className="rounded font-medium transition-opacity hover:opacity-80"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
