
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "available";

    const allowedStatuses = [
      "available",
      "pending",
      "submitted",
      "running-resubmission",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid challenge status.",
        },
        { status: 400 }
      );
    }

    // Get all UI challenges and their latest submission.
    // No userId is required or used.
    const [rows]: any = await db.query(`
      SELECT
        u.*,
        s.submission_id,
        s.start_time,
        s.submitted_at,
        s.status AS submission_status,
        s.score,
        COALESCE(attempts.submit_attempts, 0) AS submit_attempts
      FROM uichallenge u

      LEFT JOIN submissions s
        ON s.submission_id = (
          SELECT s2.submission_id
          FROM submissions s2
          WHERE s2.challenge_id = u.id
            AND s2.challenge_type = 'project'
          ORDER BY s2.submission_id DESC
          LIMIT 1
        )

      LEFT JOIN (
        SELECT
          challenge_id,
          COUNT(*) AS submit_attempts
        FROM submissions
        WHERE challenge_type = 'project'
        GROUP BY challenge_id
      ) attempts
        ON attempts.challenge_id = u.id

      ORDER BY u.id DESC
    `);

    const challenges = rows.map((item: any) => ({
      ...item,
      submit_attempts: Number(item.submit_attempts ?? 0),
    }));

    const available = challenges.filter(
      (item: any) => item.submission_id == null
    );

    const running = challenges.filter(
      (item: any) => item.submission_status === "pending"
    );

    const completed = challenges.filter(
      (item: any) => item.submission_status === "submitted"
    );

    const runningResubmission = challenges.filter(
      (item: any) =>
        item.submission_status === "running-resubmission"
    );

    let data: any[];

    switch (status) {
      case "pending":
        data = running;
        break;

      case "submitted":
        data = completed;
        break;

      case "running-resubmission":
        data = runningResubmission;
        break;

      default:
        data = available;
        break;
    }

    return NextResponse.json(
      {
        success: true,
        data,
        meta: {
          counts: {
            available: available.length,
            running: running.length,
            completed: completed.length,
            runningResubmission: runningResubmission.length,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UI challenge API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
