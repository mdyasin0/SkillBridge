import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required.",
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // Counts
    // -----------------------------
    const [[counts]]: any = await db.query(`
  SELECT
    SUM(CASE WHEN status='submitted' AND check_status='pending' THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status='submitted' AND check_status='approved' THEN 1 ELSE 0 END) AS approved
  FROM solution_submit
  
`);

    // -----------------------------
    // Data
    // -----------------------------
    const [rows]: any = await db.query(
      `
  SELECT

    -- User
    us.id AS user_id,
    us.name,
    us.email,

    -- Challenge
    u.id AS challenge_id,
    u.title,
    u.description,
    u.difficulty,
    u.allowedLanguages,
    u.timeLimit,
    u.maxAttempt,
    u.starterCode,
    u.hint,
    u.rewardBadge,
    u.createdBy,
    u.createdAt,
    u.updatedAt,
    u.category,
    

    -- Submission
    s.id AS submission_id,
    s.challenge_id,
  s.score,
  s.check_status,
  s.feedback,
  s.submit_attempts,
  s.resubmit_start_at,
  s.resubmit_submitted_at,
  s.submitCode,
  s.status,
    s.start_time,
    s.submitted_at,
    s.created_at AS submission_created_at,
    s.updated_at AS submission_updated_at

  FROM solution_submit s

  INNER JOIN challenges u
    ON u.id = s.challenge_id

  INNER JOIN users us
    ON us.id = s.user_id

  WHERE
   
      s.status = 'submitted'
      AND s.check_status = ?

  ORDER BY s.created_at DESC
  `,
      [status],
    );

    return NextResponse.json({
      success: true,
      data: rows,
      meta: {
        counts: {
          pending: Number(counts.pending ?? 0),
          approved: Number(counts.approved ?? 0),
        },
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 },
    );
  }
}
