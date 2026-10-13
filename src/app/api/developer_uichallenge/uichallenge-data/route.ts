
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const status = searchParams.get("status") || "available";

    const allowedStatuses = [
      "available",
      "pending",
      "submitted",
      "running-resubmission",
    ];

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid challenge status.",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT
        u.*,
        s.submission_id,
        s.user_id,
        s.submit_attempts,
        s.start_time,
        s.submitted_at,
        s.status AS submission_status,
        s.score,
        s.resubmit_started_at,
        s.resubmit_submitted_at

      FROM uichallenge AS u

      LEFT JOIN submissions AS s
        ON u.id = s.challenge_id
        AND s.user_id = ?

      ORDER BY u.id DESC
      `,
      [userId]
    );

    const challenges = rows.map((item: any) => ({
      ...item,
      submit_attempts: Number(item.submit_attempts ?? 0),
      maxAttempts: Number(item.maxAttempts ?? 0),
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
        item.resubmit_started_at != null &&
        item.resubmit_submitted_at == null
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
        message: "Failed to fetch UI challenges.",
      },
      { status: 500 }
    );
  }
}

