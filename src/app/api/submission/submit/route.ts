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

    // Check running submission
    const [rows]: any = await db.query(
      `
      SELECT submission_id
      FROM submissions
      WHERE user_id = ?
      AND challenge_id = ?
      AND status = 'pending'
      LIMIT 1
      `,
      [userId, challengeId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Running challenge not found.",
        },
        {
          status: 404,
        }
      );
    }

    const submitInfo = JSON.stringify({
      liveLink,
      githubLink,
      documentLink,
    });

    await db.query(
      `
      UPDATE submissions
      SET
        submitted_at = NOW(),
        status = 'submitted',
        submit_info = ?,
        check_status = 'pending',
        updated_at = NOW()
      WHERE submission_id = ?
      `,
      [submitInfo, rows[0].submission_id]
    );

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