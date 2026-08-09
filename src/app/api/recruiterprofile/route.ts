import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // ----------------------------------------
    // Parse request body
    // ----------------------------------------

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      userId,

      // Personal Information
      profilePhoto,
      fullName,
      email,
      phone,
      location,
      country,
      city,
      bio,

      // Professional Information
      jobTitle,
      department,
      experienceYears,
      specialization,
      recruitmentType,

      // Company Information
      companyLogo,
      companyName,
      companyWebsite,
      companyDescription,
      industry,
      companySize,
      companyLocation,
      companyFoundedYear,

      // Social / Professional Links
      linkedin,
      twitter,
      companyLinkedin,
    } = body;

    // ----------------------------------------
    // Validation
    // ----------------------------------------

    const missingFields: string[] = [];

    if (!userId) missingFields.push("userId");

    if (!profilePhoto) missingFields.push("profilePhoto");
    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!country) missingFields.push("country");
    if (!city) missingFields.push("city");
    if (!bio) missingFields.push("bio");

    if (!jobTitle) missingFields.push("jobTitle");
    if (!department) missingFields.push("department");

    if (experienceYears === undefined || experienceYears === null) {
      missingFields.push("experienceYears");
    }

    if (
      !specialization ||
      !Array.isArray(specialization) ||
      specialization.length === 0
    ) {
      missingFields.push("specialization");
    }

    if (!recruitmentType) missingFields.push("recruitmentType");

    if (!companyName) missingFields.push("companyName");
    if (!companyDescription) missingFields.push("companyDescription");
    if (!industry) missingFields.push("industry");
    if (!companySize) missingFields.push("companySize");
    if (!companyLocation) missingFields.push("companyLocation");

    // ----------------------------------------
    // Return missing fields
    // ----------------------------------------

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Some required fields are missing.",
          missingFields,
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------
    // Check existing recruiter profile
    // ----------------------------------------

    const [existing]: any = await db.query(
      `
      SELECT id
      FROM recruiterprofile
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Recruiter profile already exists.",
          profileId: existing[0].id,
        },
        {
          status: 409,
        }
      );
    }

    // ----------------------------------------
    // Insert recruiter profile
    // ----------------------------------------

    const [insertResult]: any = await db.query(
      `
      INSERT INTO recruiterprofile
      (
        user_id,

        profilePhoto,
        fullName,
        email,
        phone,
        location,
        country,
        city,
        bio,

        jobTitle,
        department,
        experienceYears,
        specialization,
        recruitmentType,

        companyLogo,
        companyName,
        companyWebsite,
        companyDescription,
        industry,
        companySize,
        companyLocation,
        companyFoundedYear,

        linkedin,
        twitter,
        companyLinkedin,

        verificationstatus,
        verified_at,
        created_at,
        updated_at
      )

      VALUES
      (
        ?,

        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,

        FALSE,
        NULL,
        NOW(),
        NOW()
      )
      `,
      [
        userId,

        // Personal
        profilePhoto,
        fullName,
        email,
        phone || "",
        location || "",
        country,
        city,
        bio,

        // Professional
        jobTitle,
        department,
        experienceYears,
        JSON.stringify(specialization),
        recruitmentType,

        // Company
        companyLogo || "",
        companyName,
        companyWebsite || "",
        companyDescription,
        industry,
        companySize,
        companyLocation,
        companyFoundedYear || null,

        // Social
        linkedin || "",
        twitter || "",
        companyLinkedin || "",
      ]
    );

    // ----------------------------------------
    // Success response
    // ----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Recruiter profile created successfully.",
        profileId: insertResult.insertId,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("Recruiter profile creation error:", error);

    // ----------------------------------------
    // Database error
    // ----------------------------------------

    return NextResponse.json(
      {
        success: false,
        message:
          error?.sqlMessage ||
          error?.message ||
          "Something went wrong while creating recruiter profile.",
      },
      {
        status: 500,
      }
    );
  }
}