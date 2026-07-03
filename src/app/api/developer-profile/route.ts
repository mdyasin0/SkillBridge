import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      photo,
      fullName,
      bio,
      experienceYears,
      experienceMonths,
      country,
      education,
      skills,
      techStack,
      languages,
      github,
      portfolio,
      linkedin,
    } = body;

    // Validation
    if (
      !userId ||
      !photo ||
      !fullName ||
      !bio ||
      experienceYears === undefined ||
      experienceMonths === undefined ||
      !country ||
      !education ||
      !skills ||
      !techStack ||
      !languages
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // Check profile already exists
    const [existing]: any = await db.query(
      "SELECT id FROM developerprofiles WHERE userId = ?",
      [userId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          message: "Developer profile already exists",
        },
        {
          status: 409,
        }
      );
    }

    await db.query(
      `
      INSERT INTO developerprofiles
      (
        userId,
        photo,
        fullName,
        bio,
        experienceYears,
        experienceMonths,
        country,
        education,
        skills,
        techStack,
        languages,
        github,
        portfolio,
        linkedin
      )

      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        photo,
        fullName,
        bio,
        experienceYears,
        experienceMonths,
        country,
        education,
        JSON.stringify(skills),
        techStack,
        JSON.stringify(languages),
        github || "",
        portfolio || "",
        linkedin || "",
      ]
    );

    return NextResponse.json(
      {
        message: "Developer profile created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}