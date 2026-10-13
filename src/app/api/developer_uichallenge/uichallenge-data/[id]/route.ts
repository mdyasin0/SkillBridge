
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid challenge ID",
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT
        u.id,
        u.title,
        u.description,
        u.technology,
        u.difficulty,
        u.category,
        u.timeLimit,
        u.maxAttempts,
        s.start_time,
        s.resubmit_started_at

      FROM uichallenge AS u

      LEFT JOIN submissions AS s
        ON s.submission_id = (
          SELECT s2.submission_id
          FROM submissions AS s2
          WHERE s2.challenge_id = u.id
            AND s2.user_id = ?
          ORDER BY s2.submission_id DESC
          LIMIT 1
        )

      WHERE u.id = ?
      LIMIT 1
      `,
      [userId, id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Challenge not found",
        },
        { status: 404 }
      );
    }

    const row = rows[0];

    return NextResponse.json(
      {
        success: true,
        data: {
          ...row,
          resubmitStartedAtIsNull:
            row.resubmit_started_at == null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch UI challenge error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch challenge",
      },
      { status: 500 }
    );
  }
}
