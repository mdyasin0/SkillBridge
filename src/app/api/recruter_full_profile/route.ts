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
        rp.id,
        rp.user_id,

        -- Data from users table
        u.name AS fullName,
        u.email AS email,
        u.photo AS profilePhoto,

        -- Data from recruiterprofile table
        rp.phone,
        rp.location,
        rp.country,
        rp.city,
        rp.bio,
        rp.jobTitle,
        rp.department,
        rp.experienceYears,
        rp.specialization,
        rp.recruitmentType,
        rp.companyLogo,
        rp.companyName,
        rp.companyWebsite,
        rp.companyDescription,
        rp.industry,
        rp.companySize,
        rp.companyLocation,
        rp.companyFoundedYear,
        rp.linkedin,
        rp.twitter,
        rp.companyLinkedin,
        rp.verificationstatus,
        rp.verified_at,
        rp.created_at,
        rp.updated_at

      FROM recruiterprofile rp

      INNER JOIN users u
        ON rp.user_id = u.id

      WHERE rp.user_id = ?

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