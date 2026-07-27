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
        { status: 400 }
      );
    }

    // -----------------------------
    // Counts
    // -----------------------------
 const [[counts]]: any = await db.query(`
  SELECT
    SUM(CASE WHEN status='submitted' AND check_status='pending' THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status='submitted' AND check_status='approved' THEN 1 ELSE 0 END) AS approved
  FROM submissions
  WHERE challenge_type='project'
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
    u.category,
    u.createdAt,

    -- Submission
    s.submission_id AS submission_id,
    s.submit_info,
    s.feedback,
    s.score,
    s.status,
    s.check_status,
    s.start_time,
    s.submitted_at,
    s.created_at AS submission_created_at,
    s.updated_at AS submission_updated_at

  FROM submissions s

  INNER JOIN uichallenge u
    ON u.id = s.challenge_id

  INNER JOIN users us
    ON us.id = s.user_id

  WHERE
      s.challenge_type = 'project'
      AND s.status = 'submitted'
      AND s.check_status = ?

  ORDER BY s.created_at DESC
  `,
  [status]
);

 const formattedRows = rows.map((row: any) => ({
  ...row,
  submit_info:
    typeof row.submit_info === "string"
      ? JSON.parse(row.submit_info)
      : row.submit_info,
}));
    return NextResponse.json({
      success: true,
      data: formattedRows,
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
      { status: 500 }
    );
  }
}