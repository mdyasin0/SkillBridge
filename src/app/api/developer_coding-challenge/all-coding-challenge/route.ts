
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

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
        c.id,
        c.title,
        c.description,
        c.difficulty,
        c.category,
        c.timeLimit,
        c.maxAttempt,
        c.starterCode,
        c.hint,
        c.createdBy,
        c.createdAt,
        COALESCE(s.submit_attempts, 0) AS submit_attempts,
        s.status AS submission_status
      FROM challenges c
      LEFT JOIN (
        SELECT
          challenge_id,
          user_id,
          MAX(submit_attempts) AS submit_attempts,
          MAX(status) AS status
        FROM solution_submit
        WHERE user_id = ?
        GROUP BY challenge_id, user_id
      ) s
        ON c.id = s.challenge_id
      ORDER BY c.id DESC
      `,
      [userId]
    );

    const available = rows.filter(
      (item: any) => !item.submission_status
    );

    const completed = rows.filter(
      (item: any) => !!item.submission_status
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          available,
          completed,
        },
        counts: {
          all: rows.length,
          available: available.length,
          completed: completed.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch coding challenges:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch coding challenges",
      },
      { status: 500 }
    );
  }
}
