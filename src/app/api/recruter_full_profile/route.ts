import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "userId is required",
        },
        {
          status: 400,
        },
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        user_id,
        profilePhoto AS profilePhoto,
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
      FROM recruiterprofile
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          message: "Recruiter profile not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Recruiter profile fetched successfully",
        data: rows[0],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Recruiter Profile API Error:", error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}