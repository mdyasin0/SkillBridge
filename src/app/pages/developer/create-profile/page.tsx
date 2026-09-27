"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IoIosClose } from "react-icons/io";
import { useRouter } from "next/navigation";
const profileSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
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
  const router = useRouter();
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
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      title: "",
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

  const onSubmit = async (data: ProfileForm) => {
    try {
      const payload = {
        userId,
        title: data.title,
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
      router.push("/");
      console.log(result);
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }
  };
  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    // First letter capital
    const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);

    if (skills.includes(formattedValue)) return;

    const updatedSkills = [...skills, formattedValue];

    setSkills(updatedSkills);

    setValue("skills", updatedSkills, {
      shouldValidate: true,
      shouldDirty: true,
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

    // First letter capital
    const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);

    if (languages.includes(formattedValue)) return;

    const updatedLanguages = [...languages, formattedValue];

    setLanguages(updatedLanguages);

    setValue("languages", updatedLanguages, {
      shouldValidate: true,
      shouldDirty: true,
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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, isSubmitting]);

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
          {/* Title */}
          <div>
            <label className="mb-2 block font-medium">Title</label>

            <input
              {...register("title")}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-(--border) bg-(--bg-secondary) p-3 outline-none focus:border-(--primary)"
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
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

          <div className="grid gap-5 md:grid-cols-3">
            {/* Experience Years */}
            <div>
              <label className="mb-2 block font-medium">
                Experience (Years)
              </label>

              <input
                className="w-full rounded-lg border border-(--border) p-3"
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

            {/* Experience Months */}
            <div>
              <label className="mb-2 block font-medium">
                Experience (Months)
              </label>

              <input
                className="w-full rounded-lg border border-(--border) p-3"
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
              placeholder="Type a skill and press Enter (e.g. React)"
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
              placeholder="Type a language and press Enter (e.g. JavaScript)"
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
