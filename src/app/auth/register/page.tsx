"use client";

import { useState } from "react";

import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function RegisterPage() {
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
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=c0c2b847b1b59290ac14668dd140a262",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

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

      //  ERROR CASE  TOAST
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      // SUCCESS CASE  SWEETALERT
      Swal.fire({
        title: "Success!",
        text: "Registration completed successfully",
        icon: "success",
        confirmButtonColor: "#5B6CFF",
      });

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
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-md p-6 rounded-xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* Title */}
        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
        <p style={{ color: "var(--text-muted)" }} className="mb-5">
          Join SkillBridge and prove your skills
        </p>

        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 rounded mb-1 outline-none"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name}</p>
        )}

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded mb-1 outline-none"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        {/* Photo URL */}
        <input
          type="file"
          accept="image/*"
          className="w-full p-3 rounded mb-2"
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
          <p className="text-sm mb-2" style={{ color: "red" }}>
            Profile image is required
          </p>
        )}

        {/* Role Dropdown */}
        <select
          name="role"
          className="w-full p-3 rounded mb-1 outline-none"
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
          <p className="text-red-500 text-sm mb-2">{errors.role}</p>
        )}

        {/* Password */}
        <div className="relative mb-1">
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="w-full p-3 rounded pr-16 outline-none"
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
            className="absolute right-3 top-3 text-sm"
            style={{ color: "var(--primary)" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full p-3 rounded font-medium mb-3 transition"
          style={{
            background: "var(--primary)",
            color: "white",
          }}
        >
          Register
        </button>

        {/* Login Link */}
        <p
          className="text-center mt-4 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          You already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium"
            style={{ color: "var(--primary)" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
