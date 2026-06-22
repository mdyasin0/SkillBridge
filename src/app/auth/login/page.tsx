"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function LoginPage() {
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

    //  SUCCESS SWEET ALERT
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back to SkillBridge ",
      confirmButtonColor: "#5B6CFF",
    });

    // redirect after alert
    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-md p-6 rounded-xl"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Title */}
        <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
        <p style={{ color: "var(--text-muted)" }} className="mb-5">
          Login to continue your SkillBridge journey
        </p>

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-1 outline-none"
          style={{
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--text)",
          }}
          onChange={handleChange}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email}</p>
        )}

        {/* Password */}
        <div className="relative mb-1">
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="w-full p-3 rounded pr-16 outline-none"
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
            className="absolute right-3 top-3 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password}</p>
        )}

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          className="w-full p-3 rounded font-medium transition mb-3"
          style={{
            background: "var(--primary)",
            color: "white",
          }}
        >
          Login
        </button>

        {/* Register Link */}
        <p
          className="text-center mt-4 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          You have no account?{" "}
          <Link
            href="/auth/register"
            style={{ color: "var(--primary)" }}
            className="font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
