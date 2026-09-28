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
        rp.user_id,
        u.photo AS profilePhoto,
        u.name AS fullName,
        rp.companyName

      FROM recruiterprofile rp

      LEFT JOIN users u
        ON u.id = rp.user_id

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