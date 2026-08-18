"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type FormData = {
  profilePhoto: File | string | null;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  country: string;
  city: string;
  bio: string;

  jobTitle: string;
  department: string;
  experienceYears: string;
  specialization: string[];
  recruitmentType: string;

  companyLogo: File | string | null;
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  industry: string;
  companySize: string;
  companyLocation: string;
  companyFoundedYear: string;

  linkedin: string;
  twitter: string;
  companyLinkedin: string;
};

const initialFormData: FormData = {
  profilePhoto: null,
  fullName: "",
  email: "",
  phone: "",
  location: "",
  country: "",
  city: "",
  bio: "",

  jobTitle: "",
  department: "",
  experienceYears: "",
  specialization: [],
  recruitmentType: "",

  companyLogo: null,
  companyName: "",
  companyWebsite: "",
  companyDescription: "",
  industry: "",
  companySize: "",
  companyLocation: "",
  companyFoundedYear: "",

  linkedin: "",
  twitter: "",
  companyLinkedin: "",
};

const steps = [
  {
    id: 1,
    title: "Personal",
    description: "Personal information",
  },
  {
    id: 2,
    title: "Professional",
    description: "Professional information",
  },
  {
    id: 3,
    title: "Company",
    description: "Company information",
  },
  {
    id: 4,
    title: "Social",
    description: "Professional links",
  },
];

const specializationOptions = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "DevOps",
  "UI/UX",
  "Data Engineering",
  "Machine Learning",
  "QA & Testing",
  "Cyber Security",
];

const recruitmentTypes = [
  "Technical Recruitment",
  "Talent Acquisition",
  "Engineering Recruitment",
  "HR Recruitment",
  "Executive Recruitment",
  "Freelance Recruitment",
];

const industries = [
  "Software & Technology",
  "FinTech",
  "E-Commerce",
  "HealthTech",
  "EdTech",
  "SaaS",
  "Gaming",
  "Telecommunication",
  "Banking & Finance",
  "Other",
];

const companySizes = [
  "1-10 Employees",
  "11-50 Employees",
  "51-200 Employees",
  "201-500 Employees",
  "501-1000 Employees",
  "1001-5000 Employees",
  "5000+ Employees",
];

export default function RecruiterProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
   const { user} = useAuth();
  const userId =  user?.id;
  const progress = useMemo(() => {
    return (currentStep / steps.length) * 100;
  }, [currentStep]);

  // ----------------------------------------
  // Generic input handler
  // ----------------------------------------

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ----------------------------------------
  // File upload handler
  // ----------------------------------------

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "profilePhoto" | "companyLogo",
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Please select a valid image file.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Image size must be less than 5MB.",
      }));

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));

    if (field === "profilePhoto") {
      setProfilePreview(previewUrl);
    }

    if (field === "companyLogo") {
      setCompanyLogoPreview(previewUrl);
    }

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // ----------------------------------------
  // Specialization handler
  // ----------------------------------------

  const toggleSpecialization = (value: string) => {
    setFormData((prev) => {
      const exists = prev.specialization.includes(value);

      return {
        ...prev,
        specialization: exists
          ? prev.specialization.filter((item) => item !== value)
          : [...prev.specialization, value],
      };
    });

    setErrors((prev) => ({
      ...prev,
      specialization: "",
    }));
  };

  // ----------------------------------------
  // URL validation
  // ----------------------------------------

  const isValidUrl = (value: string) => {
    if (!value.trim()) return true;

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  // ----------------------------------------
  // Step validation
  // ----------------------------------------

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }

      if (!formData.country.trim()) {
        newErrors.country = "Country is required.";
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required.";
      }

      if (!formData.bio.trim()) {
        newErrors.bio = "Please add a short professional bio.";
      }
    }

    if (step === 2) {
      if (!formData.jobTitle.trim()) {
        newErrors.jobTitle = "Job title is required.";
      }

      if (!formData.department.trim()) {
        newErrors.department = "Department is required.";
      }

      if (!formData.experienceYears) {
        newErrors.experienceYears = "Experience is required.";
      }

      if (formData.specialization.length === 0) {
        newErrors.specialization = "Select at least one specialization.";
      }

      if (!formData.recruitmentType) {
        newErrors.recruitmentType = "Recruitment type is required.";
      }
    }

    if (step === 3) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required.";
      }

      if (!formData.companyDescription.trim()) {
        newErrors.companyDescription = "Company description is required.";
      }

      if (!formData.industry) {
        newErrors.industry = "Please select an industry.";
      }

      if (!formData.companySize) {
        newErrors.companySize = "Please select company size.";
      }

      if (!formData.companyLocation.trim()) {
        newErrors.companyLocation = "Company location is required.";
      }

      if (!isValidUrl(formData.companyWebsite)) {
        newErrors.companyWebsite = "Please enter a valid website URL.";
      }
    }

    if (step === 4) {
      if (!isValidUrl(formData.linkedin)) {
        newErrors.linkedin = "Please enter a valid LinkedIn URL.";
      }

      if (!isValidUrl(formData.twitter)) {
        newErrors.twitter = "Please enter a valid Twitter/X URL.";
      }

      if (!isValidUrl(formData.companyLinkedin)) {
        newErrors.companyLinkedin =
          "Please enter a valid company LinkedIn URL.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------------------
  // Next
  // ----------------------------------------

const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
  e?.preventDefault();
  e?.stopPropagation();

  const isValid = validateStep(currentStep);

  if (!isValid) return;

  if (currentStep < 4) {
    setCurrentStep((prev) => prev + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
  // ----------------------------------------
  // Back
  // ----------------------------------------

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);

      setErrors({});

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ----------------------------------------
  // Step navigation
  // Only completed/current steps are clickable
  // ----------------------------------------

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setErrors({});

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
// ----------------------------
// imgbb image upload
// ---------------------

const uploadToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error("ImgBB upload failed");
  }

  return result.data.url;
};
  // ----------------------------------------
  // Submit
  // ----------------------------------------

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (currentStep !== 4) return;

  const isValid = validateStep(4);

  if (!isValid) return;

  setIsSubmitting(true);

  try {
    const updatedFormData = { ...formData };

    // ----------------------------------------
    // Upload profile photo
    // ----------------------------------------

    if (formData.profilePhoto instanceof File) {
      updatedFormData.profilePhoto = await uploadToImgBB(
        formData.profilePhoto
      );
    }

    // ----------------------------------------
    // Upload company logo
    // ----------------------------------------

    if (formData.companyLogo instanceof File) {
      updatedFormData.companyLogo = await uploadToImgBB(
        formData.companyLogo
      );
    }

    // ----------------------------------------
    // API payload
    // ----------------------------------------

    const payload = {
      userId,
      ...updatedFormData,
    };

    console.log("Recruiter profile payload:", payload);

    // ----------------------------------------
    // API request
    // ----------------------------------------

    const response = await fetch("/api/recruiterprofile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("API response:", result);

    // ----------------------------------------
    // API error
    // ----------------------------------------

    if (!response.ok) {
      // Missing fields
      if (
        result.missingFields &&
        Array.isArray(result.missingFields)
      ) {
        alert(
          `${result.message}\n\nMissing fields:\n${result.missingFields.join(
            "\n"
          )}`
        );

        return;
      }

      // Any other API error
      alert(result.message || "Something went wrong.");

      return;
    }

    // ----------------------------------------
    // Success
    // ----------------------------------------

    setFormData(updatedFormData);

    alert(result.message || "Recruiter profile created successfully.");

    setIsCompleted(true);
  } catch (error: any) {
    console.error("Profile submission failed:", error);

    // ----------------------------------------
    // Network / unexpected error
    // ----------------------------------------

    alert(
      error?.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  // ----------------------------------------
  // Completed screen
  // ----------------------------------------

  if (isCompleted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <svg
                className="h-8 w-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Profile Completed
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Your recruiter profile has been completed successfully. You can
              now start discovering and connecting with talented developers.
            </p>

            <button
              type="button"
              className="mt-7 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            Recruiter Setup
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Complete your recruiter profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tell developers about yourself, your company and the type of talent
            you are looking for.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Step {currentStep} of {steps.length}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {steps[currentStep - 1].description}
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-600">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step navigation */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {steps.map((step) => {
              const isCurrent = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isDisabled = step.id > currentStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleStepClick(step.id)}
                  className={`group text-left ${
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                        isCompleted
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isCurrent
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5 12 4 4L19 6"
                          />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>

                    <div className="hidden min-w-0 sm:block">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isCurrent || isCompleted
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form */}
        <form
        noValidate
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* -------------------------------- */}
          {/* STEP 1 */}
          {/* -------------------------------- */}

          {currentStep === 1 && (
            <section className="p-5 sm:p-8">
              <SectionHeader
                title="Personal Information"
                description="Add your basic personal and professional contact information."
              />

              <div className="mt-8 space-y-6">
                {/* Profile photo */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-800">
                    Profile Photo
                  </label>

                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      {profilePreview ? (
                        <Image 
                        width={20}
                        height={20}
                          src={profilePreview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          className="h-8 w-8 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"
                          />
                        </svg>
                      )}
                    </div>

                    <div>
                      <label className="inline-flex cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        Upload photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "profilePhoto")}
                        />
                      </label>

                      <p className="mt-2 text-xs text-slate-400">
                        PNG, JPG or WEBP. Max 5MB.
                      </p>
                    </div>
                  </div>

                  {errors.profilePhoto && (
                    <ErrorMessage message={errors.profilePhoto} />
                  )}
                </div>

                {/* Full name + email */}
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    error={errors.fullName}
                  />

                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    error={errors.email}
                  />
                </div>

                {/* Phone + country */}
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX"
                  />

                  <InputField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Bangladesh"
                    required
                    error={errors.country}
                  />
                </div>

                {/* City + location */}
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    required
                    error={errors.city}
                  />

                  <InputField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Gulshan, Dhaka"
                  />
                </div>

                {/* Bio */}
                <TextAreaField
                  label="Professional Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short introduction about yourself and your recruitment experience..."
                  rows={5}
                  required
                  error={errors.bio}
                />
              </div>
            </section>
          )}

          {/* -------------------------------- */}
          {/* STEP 2 */}
          {/* -------------------------------- */}

          {currentStep === 2 && (
            <section className="p-5 sm:p-8">
              <SectionHeader
                title="Professional Information"
                description="Tell developers about your recruitment background and specialization."
              />

              <div className="mt-8 space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Senior Technical Recruiter"
                    required
                    error={errors.jobTitle}
                  />

                  <InputField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Human Resources"
                    required
                    error={errors.department}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Experience"
                    name="experienceYears"
                    type="number"
                    min="0"
                    max="60"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="5"
                    required
                    error={errors.experienceYears}
                  />

                  <SelectField
                    label="Recruitment Type"
                    name="recruitmentType"
                    value={formData.recruitmentType}
                    onChange={handleChange}
                    required
                    error={errors.recruitmentType}
                  >
                    <option value="">Select recruitment type</option>

                    {recruitmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </SelectField>
                </div>

                {/* Specialization */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Specialization <Required />
                  </label>

                  <p className="mb-3 text-xs text-slate-500">
                    Select the areas you usually recruit for.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {specializationOptions.map((item) => {
                      const selected = formData.specialization.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSpecialization(item)}
                          className={`rounded-xl border p-3 text-left text-sm font-medium transition ${
                            selected
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                selected
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-300"
                              }`}
                            >
                              {selected && (
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m5 12 4 4L19 6"
                                  />
                                </svg>
                              )}
                            </span>

                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {errors.specialization && (
                    <ErrorMessage message={errors.specialization} />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* -------------------------------- */}
          {/* STEP 3 */}
          {/* -------------------------------- */}

          {currentStep === 3 && (
            <section className="p-5 sm:p-8">
              <SectionHeader
                title="Company Information"
                description="Add information about the company you represent."
              />

              <div className="mt-8 space-y-6">
                {/* Company logo */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-800">
                    Company Logo
                  </label>

                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      {companyLogoPreview ? (
                        <Image
                          src={companyLogoPreview}
                          alt="Company logo preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          className="h-8 w-8 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 21h16.5M4.5 18.75V7.5A1.5 1.5 0 0 1 6 6h3.75v12.75M13.5 18.75V6H18a1.5 1.5 0 0 1 1.5 1.5v11.25"
                          />
                        </svg>
                      )}
                    </div>

                    <div>
                      <label className="inline-flex cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        Upload logo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "companyLogo")}
                        />
                      </label>

                      <p className="mt-2 text-xs text-slate-400">
                        PNG, JPG or WEBP. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="TechNova Ltd."
                    required
                    error={errors.companyName}
                  />

                  <InputField
                    label="Company Website"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    error={errors.companyWebsite}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    error={errors.industry}
                  >
                    <option value="">Select industry</option>

                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    label="Company Size"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    required
                    error={errors.companySize}
                  >
                    <option value="">Select company size</option>

                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Company Location"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="Dhaka, Bangladesh"
                    required
                    error={errors.companyLocation}
                  />

                  <InputField
                    label="Founded Year"
                    name="companyFoundedYear"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.companyFoundedYear}
                    onChange={handleChange}
                    placeholder="2018"
                  />
                </div>

                <TextAreaField
                  label="Company Description"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell developers about your company, products, culture and work environment..."
                  rows={6}
                  required
                  error={errors.companyDescription}
                />
              </div>
            </section>
          )}

          {/* -------------------------------- */}
          {/* STEP 4 */}
          {/* -------------------------------- */}

          {currentStep === 4 && (
            <section className="p-5 sm:p-8">
              <SectionHeader
                title="Social & Professional Links"
                description="Add professional links so developers can learn more about you and your company."
              />

              <div className="mt-8 space-y-6">
                <InputField
                  label="LinkedIn"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  error={errors.linkedin}
                />

                <InputField
                  label="Twitter / X"
                  name="twitter"
                  type="url"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://x.com/username"
                  error={errors.twitter}
                />

                <InputField
                  label="Company LinkedIn"
                  name="companyLinkedin"
                  type="url"
                  value={formData.companyLinkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/company-name"
                  error={errors.companyLinkedin}
                />

                {/* Final review */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" d="M12 10v6" />
                        <path strokeLinecap="round" d="M12 7.5h.01" />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-blue-900">
                        Almost there
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-blue-800/80">
                        Review your information before completing your recruiter
                        profile. You can always go back and edit any previous
                        step.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* -------------------------------- */}
          {/* Footer Navigation */}
          {/* -------------------------------- */}

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              ← Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting ? "Completing..." : "Finish"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

/* =====================================================
   Reusable Components
===================================================== */

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: string;
  max?: string | number;
};

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  min,
  max,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}

        {required && <Required />}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function SelectField({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  children,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}

        {required && <Required />}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      >
        {children}
      </select>

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
};

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 5,
  required = false,
  error,
}: TextAreaFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}

        {required && <Required />}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function Required() {
  return <span className="ml-1 text-red-500">*</span>;
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-6">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>

      <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
