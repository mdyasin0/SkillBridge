import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { userId, challengeId } = body;

    if (!userId || !challengeId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and Challenge ID are required.",
        },
        {
          status: 400,
        },
      );
    }

    // Check pending challenge
    const [pendingRows]: any = await db.query(
      `
  SELECT COUNT(*) AS pendingCount
  FROM submissions
  WHERE user_id = ?
    AND status = 'pending'
  `,
      [userId],
    );

    const pendingCount = pendingRows[0].pendingCount;

    if (pendingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          pendingCount,
          message: `You already have ${pendingCount} pending work${
            pendingCount > 1 ? "s" : ""
          }. Submit ${
            pendingCount > 1 ? "them" : "it"
          } before starting a new work.`,
        },
        {
          status: 400,
        },
      );
    }

    const [runningResubmit]: any = await db.query(
      `
  SELECT COUNT(*) AS resubmitCount
  FROM submissions
  WHERE user_id = ?
    AND resubmit_started_at IS NOT NULL
    AND resubmit_submitted_at IS NULL
  `,
      [userId],
    );

    const resubmitCount = runningResubmit[0].resubmitCount;

    if (resubmitCount > 0) {
      return NextResponse.json(
        {
          success: false,
          resubmitCount,
          message: `You already have ${resubmitCount} active resubmission${
            resubmitCount > 1 ? "s" : ""
          }. Submit ${
            resubmitCount > 1 ? "them" : "it"
          } before starting a new resubmission.`,
        },
        {
          status: 400,
        },
      );
    }

    // Find target submission
    const [rows]: any = await db.query(
      `
      SELECT submission_id
      FROM submissions
      WHERE user_id = ?
        AND challenge_id = ?
      LIMIT 1
      `,
      [userId, challengeId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission not found.",
        },
        {
          status: 404,
        },
      );
    }

    // Start resubmission
    await db.query(
      `
      UPDATE submissions
      SET
        resubmit_started_at = NOW(),
        resubmit_submitted_at = NULL,
        updated_at = NOW()
      WHERE submission_id = ?
      `,
      [rows[0].submission_id],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Resubmission session started.",
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
