
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

    console.log("\n========== PROJECT SUBMISSION API ==========");
    console.log("Received userId:", userId);
    console.log("Received challengeId:", challengeId);

    // Validate required fields
    if (
      !userId ||
      !challengeId ||
      !liveLink ||
      !githubLink ||
      !documentLink
    ) {
      console.log("❌ ERROR: Required fields are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // Find existing submission
    const [rows]: any = await db.query(
      `
      SELECT
        s.submission_id,
        s.submit_attempts,
        s.status,
        s.check_status,
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
      console.log("❌ ERROR: Submission not found.");
      console.log("===========================================\n");

      return NextResponse.json(
        {
          success: false,
          message: "Submission not found.",
        },
        { status: 404 }
      );
    }

    const submission = rows[0];

    const previousAttempts = Number(submission.submit_attempts ?? 0);
    const maxAttempts = Number(submission.maxAttempts);

    console.log("Submission ID:", submission.submission_id);
    console.log("Previous attempts:", previousAttempts);
    console.log("Maximum attempts:", maxAttempts);
    console.log("Current status:", submission.status);
    console.log("Current check_status:", submission.check_status);

    // Check maximum attempts
    if (previousAttempts >= maxAttempts) {
      console.log("❌ SUBMISSION BLOCKED: Maximum attempts reached.");
      console.log("Attempts remain unchanged:", previousAttempts);
      console.log("===========================================\n");

      return NextResponse.json(
        {
          success: false,
          message:
            "You have reached the maximum submit attempts. You cannot submit again.",
          submit_attempts: previousAttempts,
          maxAttempts,
        },
        { status: 400 }
      );
    }

    const submitInfo = JSON.stringify({
      liveLink,
      githubLink,
      documentLink,
    });

    let updateResult: any;

    // First submission
    if (submission.status === "pending") {
      console.log("➡️ ACTION: First submission");

      [updateResult] = await db.query(
        `
        UPDATE submissions
        SET
          submit_attempts = COALESCE(submit_attempts, 0) + 1,
          submitted_at = NOW(),
          status = 'submitted',
          submit_info = ?,
          check_status = 'pending',
          updated_at = NOW()
        WHERE submission_id = ?
        `,
        [submitInfo, submission.submission_id]
      );
    } else {
      // Resubmission
      console.log("➡️ ACTION: Resubmission");
      console.log("Previous status:", submission.status);

      [updateResult] = await db.query(
        `
        UPDATE submissions
        SET
          submit_attempts = COALESCE(submit_attempts, 0) + 1,
          resubmit_submitted_at = NOW(),
          submit_info = ?,
          check_status = 'pending',
          updated_at = NOW()
        WHERE submission_id = ?
        `,
        [submitInfo, submission.submission_id]
      );
    }

    console.log("UPDATE affectedRows:", updateResult.affectedRows);
    console.log("UPDATE changedRows:", updateResult.changedRows);

    // Read back the updated database value
    const [updatedRows]: any = await db.query(
      `
      SELECT
        submission_id,
        submit_attempts,
        status,
        check_status,
        submitted_at,
        resubmit_submitted_at
      FROM submissions
      WHERE submission_id = ?
      `,
      [submission.submission_id]
    );

    if (updatedRows.length === 0) {
      console.log("❌ ERROR: Could not find submission after update.");

      return NextResponse.json(
        {
          success: false,
          message: "Submission update could not be verified.",
        },
        { status: 500 }
      );
    }

    const updatedSubmission = updatedRows[0];
    const currentAttempts = Number(updatedSubmission.submit_attempts ?? 0);
    const attemptsIncreased = currentAttempts > previousAttempts;

    console.log("Previous attempts:", previousAttempts);
    console.log("Updated attempts:", currentAttempts);
    console.log(
      attemptsIncreased
        ? "✅ SUCCESS: submit_attempts increased."
        : "❌ WARNING: submit_attempts did NOT increase."
    );
    console.log("Updated status:", updatedSubmission.status);
    console.log("Updated check_status:", updatedSubmission.check_status);
    console.log("===========================================\n");

    return NextResponse.json(
      {
        success: true,
        message: attemptsIncreased
          ? "Project submitted successfully. Attempt count increased."
          : "Submission updated, but attempt count did not increase.",
        previousAttempts,
        submit_attempts: currentAttempts,
        maxAttempts,
        attemptsIncreased,
        status: updatedSubmission.status,
        check_status: updatedSubmission.check_status,
        affectedRows: updateResult.affectedRows,
        changedRows: updateResult.changedRows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ PROJECT SUBMISSION API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
