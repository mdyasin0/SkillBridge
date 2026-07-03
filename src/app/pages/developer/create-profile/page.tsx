"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";
const profileSchema = z.object({
  photo: z.custom<FileList>().refine((files) => files.length === 1, {
    message: "Profile photo is required",
  }),
  fullName: z.string().trim().min(3, "Full name is required"),
  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
    .max(160, "Bio cannot exceed 160 characters"),
  experienceYears: z
    .number()
    .min(0, "Years cannot be negative")
    .max(50, "Maximum 50 years"),

  experienceMonths: z
    .number()
    .min(0, "Months cannot be negative")
    .max(11, "Maximum 11 months"),
  country: z.string().trim().min(2, "Country is required"),
  education: z.string().trim().min(2, "Education is required"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  techStack: z.string().trim().min(2, "Tech Stack is required"),
  languages: z.array(z.string()).min(1, "Add at least one language"),
  github: z.string().trim().url("Invalid GitHub URL"),
  portfolio: z.string().trim().url("Invalid Portfolio URL"),
  linkedin: z.string().trim().url("Invalid LinkedIn URL"),
});

type ProfileForm = z.infer<typeof profileSchema>;
export default function CompleteProfilePage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const { user } = useAuth();
  const userId = user?.id;
  console.log("userid", userId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      fullName: "",
      bio: "",
      experienceYears: 0,

      experienceMonths: 0,
      country: "",
      education: "",
      skills: [],
      techStack: "",

      languages: [],
      github: "",
      portfolio: "",
      linkedin: "",
    },
  });
  const bio = watch("bio") || "";
  const uploadImage = async (image: File) => {
    const formData = new FormData();

    formData.append("image", image);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    return data.data.url;
  };
  const photo = watch("photo");

  const preview = useMemo(() => {
    if (!photo || photo.length === 0) return null;

    return URL.createObjectURL(photo[0]);
  }, [photo]);
  const onSubmit = async (data: ProfileForm) => {
    try {
      const image = data.photo?.[0];

      if (!image) return;

      const photoURL = await uploadImage(image);

      const payload = {
        userId,
        photo: photoURL,
        fullName: data.fullName,
        bio: data.bio,
        experienceYears: data.experienceYears,
        experienceMonths: data.experienceMonths,
        country: data.country,
        education: data.education,
        skills,
        techStack: data.techStack,
        languages,
        github: data.github,
        portfolio: data.portfolio,
        linkedin: data.linkedin,
      };

      const res = await fetch("/api/developer-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      alert(result.message);

      console.log(result);
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }
  };
  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (skills.includes(value)) return;

    const updatedSkills = [...skills, value];

    setSkills(updatedSkills);

    // React Hook Form update
    setValue("skills", updatedSkills, {
      shouldValidate: true,
    });

    setSkillInput("");
  };
  const removeSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill);

    setSkills(updatedSkills);

    setValue("skills", updatedSkills, {
      shouldValidate: true,
    });
  };
  const addLanguage = () => {
    const value = languageInput.trim();

    if (!value) return;

    if (languages.includes(value)) return;

    const updatedLanguages = [...languages, value];

    setLanguages(updatedLanguages);

    setValue("languages", updatedLanguages, {
      shouldValidate: true,
    });

    setLanguageInput("");
  };
  const removeLanguage = (language: string) => {
    const updatedLanguages = languages.filter((l) => l !== language);

    setLanguages(updatedLanguages);

    setValue("languages", updatedLanguages, {
      shouldValidate: true,
    });
  };
  return (
    <div className="min-h-screen bg-(--bg) py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-(--border) bg-(--surface) p-8 shadow-(--shadow)">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-(--text)">
            Complete Your Profile
          </h1>

          <p className="mt-2 text-sm text-(--text-muted)">
            Complete your developer profile to start taking assessments and get
            discovered by recruiters.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="mb-2 block font-medium">Profile Photo</label>

            <div className="flex items-center gap-5">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-(--border)">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile Preview"
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-(--text-muted)">
                    No Image
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                {...register("photo")}
                className="block w-full rounded-lg border border-(--border) bg-(--bg-secondary) file:mr-4 file:border-0 file:bg-(--primary) file:px-4 file:py-2 file:text-white"
              />
            </div>

            {errors.photo && (
              <p className="mt-2 text-sm text-red-500">
                {errors.photo.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block font-medium">Full Name</label>

            <input
              {...register("fullName")}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block font-medium">Bio</label>

            <textarea
              rows={4}
              maxLength={160}
              {...register("bio")}
              placeholder="Write a short introduction..."
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />

            <div className="mt-1 flex justify-between">
              {errors.bio ? (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              ) : (
                <span />
              )}

              <p className="text-sm text-(--text-muted)">{bio.length}/160</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-medium">
                  Experience (Years)
                </label>

                <input
                  className="border border-(--border) p-3 rounded-lg"
                  type="number"
                  {...register("experienceYears", {
                    valueAsNumber: true,
                  })}
                />

                {errors.experienceYears && (
                  <p className="text-sm text-red-500">
                    {errors.experienceYears.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-medium">Months</label>

                <input
                  className="border border-(--border) p-3 rounded-lg"
                  type="number"
                  {...register("experienceMonths", {
                    valueAsNumber: true,
                  })}
                />
                {errors.experienceMonths && (
                  <p className="text-sm text-red-500">
                    {errors.experienceMonths.message}
                  </p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="mb-2 block font-medium">Country</label>

              <input
                {...register("country")}
                placeholder="Bangladesh"
                className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
              />

              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="mb-2 block font-medium">Education</label>

            <input
              {...register("education")}
              placeholder="BSc in Computer Science"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />
            {errors.education && (
              <p className="text-sm text-red-500">{errors.education.message}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="mb-2 block font-medium">Skills</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => removeSkill(skill)}
                  className="rounded-full bg-(--primary) px-3 py-1 text-sm text-white"
                >
                  {skill} <IoIosClose />
                </button>
              ))}
            </div>
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="React"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
            )}
          </div>

          {/* Tech Stack */}
          <div>
            <label className="mb-2 block font-medium">Tech Stack</label>

            <input
              {...register("techStack")}
              placeholder="MERN Stack"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />
            {errors.techStack && (
              <p className="text-sm text-red-500">{errors.techStack.message}</p>
            )}
          </div>

          {/* Languages */}
          <div>
            <label className="mb-2 block font-medium">Languages</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map((language) => (
                <button
                  type="button"
                  key={language}
                  onClick={() => removeLanguage(language)}
                  className="rounded-full bg-(--primary) px-3 py-1 text-sm text-white"
                >
                  {language} <IoIosClose />
                </button>
              ))}
            </div>

            <input
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLanguage();
                }
              }}
              placeholder="javascript"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />
            {errors.languages && (
              <p className="text-sm text-red-500">{errors.languages.message}</p>
            )}
          </div>

          {/* GitHub */}
          <div>
            <label className="mb-2 block font-medium">GitHub</label>

            <input
              {...register("github")}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />
            {errors.github && (
              <p className="text-sm text-red-500">{errors.github.message}</p>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <label className="mb-2 block font-medium">Portfolio</label>

            <input
              {...register("portfolio")}
              placeholder="https://yourportfolio.com"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />
            {errors.portfolio && (
              <p className="text-sm text-red-500">{errors.portfolio.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="mb-2 block font-medium">LinkedIn</label>

            <input
              {...register("linkedin")}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />
            {errors.linkedin && (
              <p className="text-sm text-red-500">{errors.linkedin.message}</p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-lg bg-(--primary) py-3 font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
