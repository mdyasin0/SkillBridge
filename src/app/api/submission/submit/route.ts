import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      challengeId,
      liveLink,
      githubLink,
      documentLink,
    } = body;

    if (
      !userId ||
      !challengeId ||
      !liveLink ||
      !githubLink ||
      !documentLink
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Find submission
    const [rows]: any = await db.query(
      `
      SELECT
        s.submission_id,
        s.submit_attempts,
        s.status,
        u.maxAttempts
      FROM submissions s
      INNER JOIN uichallenge u
        ON s.challenge_id = u.id
      WHERE s.user_id = ?
        AND s.challenge_id = ?
      LIMIT 1
      `,
      [userId, challengeId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission not found.",
        },
        {
          status: 404,
        }
      );
    }

    const submission = rows[0];

    // Max attempts reached
    if (submission.submit_attempts >= submission.maxAttempts) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have reached the maximum submit attempts. You cannot submit again.",
        },
        {
          status: 400,
        }
      );
    }

    const submitInfo = JSON.stringify({
      liveLink,
      githubLink,
      documentLink,
    });

    // First submit
    if (submission.status === "pending") {
      await db.query(
        `
        UPDATE submissions
        SET
          submit_attempts = submit_attempts + 1,
          submitted_at = NOW(),
          status = 'submitted',
          submit_info = ?,
          check_status = 'pending',
          updated_at = NOW()
        WHERE submission_id = ?
        `,
        [submitInfo, submission.submission_id]
      );
    } 
    // Resubmit
    else {
      await db.query(
        `
        UPDATE submissions
        SET
          submit_attempts = submit_attempts + 1,
          resubmit_submitted_at = NOW(),
          submit_info = ?,
          check_status = 'pending',
          updated_at = NOW()
        WHERE submission_id = ?
        `,
        [submitInfo, submission.submission_id]
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project submitted successfully.",
      },
      {
        status: 200,
      }
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
      }
    );
  }
}