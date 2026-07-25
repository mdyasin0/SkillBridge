import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, challengeId } = body;

    if (!userId || !challengeId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and Challenge ID are required.",
        },
        { status: 400 }
      );
    }


// আগে check করো
const [attemptRows]: any = await db.query(
  `
  SELECT
    ss.submit_attempts,
    cc.maxAttempt
  FROM solution_submit ss
  JOIN challenges cc
    ON cc.id = ss.challenge_id
  WHERE
    ss.user_id = ?
    AND ss.challenge_id = ?
  LIMIT 1
  `,
  [userId, challengeId]
);

if (attemptRows.length === 0) {
  return NextResponse.json(
    {
      success: false,
      message: "Submission not found.",
      code: "SUBMISSION_NOT_FOUND",
    },
    { status: 404 }
  );
}

const { submit_attempts, maxAttempt } = attemptRows[0];

if (submit_attempts >= maxAttempt) {
  return NextResponse.json(
    {
      success: false,
      message: "You have reached the maximum number of attempts.",
      code: "MAX_ATTEMPTS_REACHED",
    },
    { status: 400 }
  );
}

    const [result]: any = await db.query(
      `
      UPDATE solution_submit
      SET
        resubmit_start_at = NOW(),
        submit_attempts = submit_attempts + 1
      WHERE
        user_id = ?
        AND challenge_id = ?
      `,
      [userId, challengeId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission not found.",
        },
        { status: 404 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT id
      FROM solution_submit
      WHERE user_id = ?
      AND challenge_id = ?
      LIMIT 1
      `,
      [userId, challengeId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Challenge resubmission started successfully.",
        solutionId: rows[0].id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}