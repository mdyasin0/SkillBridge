
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      photo: "",
      password: "",
      role: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!imageFile) {
      newErrors.photo = "Photo is required";
      valid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    if (!form.role.trim()) {
      newErrors.role = "Please select a role";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const uploadImageToImgbb = async (file: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // console.log("ImgBB response:", data);

    if (!res.ok || !data.success || !data.data?.url) {
      throw new Error(data?.error?.message || "Image upload failed");
    }

    return data.data.url;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setUploading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImageToImgbb(imageFile);
      }

      const res = await fetch("/api/auth/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          photo: imageUrl,
        }),
      });

      const data = await res.json();

      // ERROR CASE TOAST
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      // SUCCESS CASE SWEETALERT
      Swal.fire({
        title: "Success!",
        text: "Registration completed successfully",
        icon: "success",
        confirmButtonColor: "#5B6CFF",
      });

      router.push("/auth/login");

      // optional reset
      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
      });
      setImageFile(null);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center px-3 py-6 sm:px-5 sm:py-8"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div
        className="w-full min-w-0 max-w-md rounded-xl p-4 sm:p-6 md:p-7"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* Title */}
        <h1 className="mb-1 text-xl font-bold sm:text-2xl">
          Create Account
        </h1>

        <p
          className="mb-5 text-sm sm:text-base"
          style={{ color: "var(--text-muted)" }}
        >
          Join SkillBridge and prove your skills
        </p>

        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          className="mb-1 w-full min-w-0 rounded-lg p-3 text-sm outline-none transition sm:text-base"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onChange={handleChange}
        />

        {errors.name && (
          <p
            className="mb-2 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {errors.name}
          </p>
        )}

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mb-1 w-full min-w-0 rounded-lg p-3 text-sm outline-none transition sm:text-base"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onChange={handleChange}
        />

        {errors.email && (
          <p
            className="mb-2 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {errors.email}
          </p>
        )}

        {/* Photo URL */}
        <input
          type="file"
          accept="image/*"
          className="mb-2 w-full min-w-0 rounded-lg p-2.5 text-sm outline-none sm:p-3 sm:text-base"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImageFile(e.target.files[0]);
            }
          }}
        />

        {!imageFile && (
          <p
            className="mb-2 text-sm"
            style={{ color: "var(--primary)" }}
          >
            Profile image is required
          </p>
        )}

        {/* Role Dropdown */}
        <select
          name="role"
          className="mb-1 w-full min-w-0 rounded-lg p-3 text-sm outline-none transition sm:text-base"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="developer">Developer</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {errors.role && (
          <p
            className="mb-2 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {errors.role}
          </p>
        )}

        {/* Password */}
        <div className="relative mb-1 w-full min-w-0">
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="w-full min-w-0 rounded-lg p-3 pr-16 text-sm outline-none transition sm:text-base"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p
            className="mb-2 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {errors.password}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mb-3 mt-3 w-full rounded-lg p-3 font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "var(--primary)",
            color: "var(--bg-secondary)",
          }}
          disabled={uploading}
        >
          Register
        </button>

        {/* Login Link */}
        <p
          className="mt-4 text-center text-xs leading-6 sm:text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          You already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium transition hover:opacity-80"
            style={{ color: "var(--primary)" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
