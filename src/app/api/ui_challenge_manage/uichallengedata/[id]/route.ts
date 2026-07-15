import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT
        u.*,
        s.submission_id,
        s.start_time,
        s.submitted_at,
        s.status,
        s.score
      FROM uichallenge u
      LEFT JOIN submissions s
        ON u.id = s.challenge_id
        AND s.user_id = ?
        AND s.challenge_type = 'project'
      WHERE u.id = ?
      LIMIT 1
      `,
      [userId, id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Challenge not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: rows[0],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}