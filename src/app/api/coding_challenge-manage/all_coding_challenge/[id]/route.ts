import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT
        c.*,

        ss.id AS solutionId,
        ss.score,
        ss.feedback,
        ss.check_status,
        ss.submit_attempts,
        ss.start_time,
        ss.submitCode,
        ss.submitted_at,
        ss.resubmit_start_at,
        ss.resubmit_submitted_at

      FROM challenges c

      LEFT JOIN solution_submit ss
      ON c.id = ss.challenge_id
      AND ss.user_id = ?

      WHERE c.id = ?
      LIMIT 1
      `,
      [userId, id]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          message: "Challenge not found",
        },
        {
          status: 404,
        }
      );
    }

    const challenge = {
      ...rows[0],
      allowedLanguages: JSON.parse(rows[0].allowedLanguages || "[]"),
      testCases: JSON.parse(rows[0].testCases || "[]"),
    };

    return NextResponse.json({
      success: true,
      data: challenge,
    });
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