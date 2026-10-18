
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IoIosClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

      toast.info(result.message);
      router.push("/");
    } catch (error) {
      toast.error(String(error));
      toast.info("Something went wrong");
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

  const inputClass =
    "box-border w-full min-w-0 rounded-lg border border-(--border) bg-(--bg-secondary) p-3 text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20";

  const labelClass = "mb-2 block text-sm font-medium text-(--text)";

  const errorClass = "mt-1 text-sm text-(--text-muted)";

  return (
    <div className="min-h-screen bg-(--bg) px-3 py-5 transition-colors duration-300 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-(--border) bg-(--surface) p-4 shadow-(--shadow) transition-colors duration-300 sm:rounded-2xl sm:p-6 md:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold leading-tight text-(--text) sm:text-3xl">
            Complete Your Profile
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-(--text-muted)">
            Complete your developer profile to start taking assessments and get
            discovered by recruiters.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          {/* Title */}
          <div className="min-w-0">
            <label className={labelClass}>Title</label>

            <input
              {...register("title")}
              placeholder="Enter title 'Full stack developer'"
              className={inputClass}
            />

            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="min-w-0">
            <label className={labelClass}>Bio</label>

            <textarea
              rows={4}
              maxLength={160}
              {...register("bio")}
              placeholder="Write a short introduction..."
              className={`${inputClass} min-h-28 resize-y`}
            />

            <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
              {errors.bio ? (
                <p className={errorClass}>{errors.bio.message}</p>
              ) : (
                <span />
              )}

              <p className="shrink-0 text-sm text-(--text-muted)">
                {bio.length}/160
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {/* Experience Years */}
            <div className="min-w-0">
              <label className={labelClass}>Experience (Years)</label>

              <input
                className={inputClass}
                type="number"
                {...register("experienceYears", {
                  valueAsNumber: true,
                })}
              />

              {errors.experienceYears && (
                <p className={errorClass}>
                  {errors.experienceYears.message}
                </p>
              )}
            </div>

            {/* Experience Months */}
            <div className="min-w-0">
              <label className={labelClass}>Experience (Months)</label>

              <input
                className={inputClass}
                type="number"
                {...register("experienceMonths", {
                  valueAsNumber: true,
                })}
              />

              {errors.experienceMonths && (
                <p className={errorClass}>
                  {errors.experienceMonths.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="min-w-0">
              <label className={labelClass}>Country</label>

              <input
                {...register("country")}
                placeholder="Bangladesh"
                className={inputClass}
              />

              {errors.country && (
                <p className={errorClass}>{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="min-w-0">
            <label className={labelClass}>Education</label>

            <input
              {...register("education")}
              placeholder="BSc in Computer Science"
              className={inputClass}
            />

            {errors.education && (
              <p className={errorClass}>{errors.education.message}</p>
            )}
          </div>

          {/* Skills */}
          <div className="min-w-0">
            <label className={labelClass}>Skills</label>

            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => removeSkill(skill)}
                  className="inline-flex max-w-full items-center gap-1 rounded-full bg-(--primary) px-3 py-1.5 text-sm text-white transition-colors hover:bg-(--primary-hover)"
                >
                  <span className="break-words">{skill}</span>
                  <IoIosClose className="shrink-0 text-lg" />
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
              className={`${inputClass} mt-3`}
            />

            {errors.skills && (
              <p className={errorClass}>{errors.skills.message}</p>
            )}
          </div>

          {/* Tech Stack */}
          <div className="min-w-0">
            <label className={labelClass}>Tech Stack</label>

            <input
              {...register("techStack")}
              placeholder="MERN Stack"
              className={inputClass}
            />

            {errors.techStack && (
              <p className={errorClass}>{errors.techStack.message}</p>
            )}
          </div>

          {/* Languages */}
          <div className="min-w-0">
            <label className={labelClass}>Languages</label>

            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map((language) => (
                <button
                  type="button"
                  key={language}
                  onClick={() => removeLanguage(language)}
                  className="inline-flex max-w-full items-center gap-1 rounded-full bg-(--primary) px-3 py-1.5 text-sm text-white transition-colors hover:bg-(--primary-hover)"
                >
                  <span className="break-words">{language}</span>
                  <IoIosClose className="shrink-0 text-lg" />
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
              className={`${inputClass} mt-3`}
            />

            {errors.languages && (
              <p className={errorClass}>{errors.languages.message}</p>
            )}
          </div>

          {/* GitHub */}
          <div className="min-w-0">
            <label className={labelClass}>GitHub</label>

            <input
              {...register("github")}
              placeholder="https://github.com/username"
              className={inputClass}
            />

            {errors.github && (
              <p className={errorClass}>{errors.github.message}</p>
            )}
          </div>

          {/* Portfolio */}
          <div className="min-w-0">
            <label className={labelClass}>Portfolio</label>

            <input
              {...register("portfolio")}
              placeholder="https://yourportfolio.com"
              className={inputClass}
            />

            {errors.portfolio && (
              <p className={errorClass}>{errors.portfolio.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="min-w-0">
            <label className={labelClass}>LinkedIn</label>

            <input
              {...register("linkedin")}
              placeholder="https://linkedin.com/in/username"
              className={inputClass}
            />

            {errors.linkedin && (
              <p className={errorClass}>{errors.linkedin.message}</p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-lg bg-(--primary) px-4 py-3 font-semibold text-white transition-colors hover:bg-(--primary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
