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

    // Validate challenge ID
    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid challenge ID",
        },
        { status: 400 }
      );
    }

    // Validate user ID
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

        ss.id AS solutionId,
        ss.score,
        ss.feedback,
        ss.check_status,
        COALESCE(ss.submit_attempts, 0) AS submit_attempts,
        ss.start_time,
        ss.submitted_at,
        ss.resubmit_start_at,
        ss.resubmit_submitted_at

      FROM challenges AS c

      LEFT JOIN solution_submit AS ss
        ON ss.id = (
          SELECT s2.id
          FROM solution_submit AS s2
          WHERE s2.challenge_id = c.id
            AND s2.user_id = ?
          ORDER BY s2.id DESC
          LIMIT 1
        )

      WHERE c.id = ?
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

    const challenge = {
      ...rows[0],
      solutionId: rows[0].solutionId ?? null,
      score: rows[0].score ?? null,
      feedback: rows[0].feedback ?? null,
      check_status: rows[0].check_status ?? null,
      submit_attempts: Number(rows[0].submit_attempts ?? 0),
      start_time: rows[0].start_time ?? null,
      submitted_at: rows[0].submitted_at ?? null,
      resubmit_start_at: rows[0].resubmit_start_at ?? null,
      resubmit_submitted_at: rows[0].resubmit_submitted_at ?? null,
      testCases: [],
    };

    return NextResponse.json(
      {
        success: true,
        data: challenge,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch challenge details:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch challenge details",
      },
      { status: 500 }
    );
  }
}