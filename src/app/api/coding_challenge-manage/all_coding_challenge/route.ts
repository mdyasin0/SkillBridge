import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

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
        c.allowedLanguages,
        c.timeLimit,
        c.maxAttempt,
        c.starterCode,
        c.hint,
        c.rewardBadge,
        c.createdBy,
        c.createdAt,

        ss.id AS solutionId,
        ss.score,
        ss.feedback,
        ss.check_status,
        ss.submit_attempts,
        ss.start_time,
        ss.submitted_at,
        ss.resubmit_start_at,
        ss.resubmit_submitted_at

      FROM challenges c

      LEFT JOIN solution_submit ss
      ON c.id = ss.challenge_id
      AND ss.user_id = ?

      ORDER BY c.id DESC
      `,
      [userId]
    );

    const allChallenges = rows.map((item: any) => ({
      ...item,
      allowedLanguages: JSON.parse(item.allowedLanguages || "[]"),
    }));

    // User যেগুলো submit করেনি
    const available = allChallenges.filter(
      (item: any) => item.solutionId === null
    );

    // User যেগুলো submit করেছে
    const completed = allChallenges.filter(
      (item: any) => item.solutionId !== null
    );

    return NextResponse.json({
      success: true,

      counts: {
        available: available.length,
        completed: completed.length,
      },

      data: {
        available,
        completed,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}