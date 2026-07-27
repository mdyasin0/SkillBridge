import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      submissionId,
      feedback,
      score,
    } = body;

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission ID is required.",
        },
        { status: 400 }
      );
    }

    if (!feedback?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback is required.",
        },
        { status: 400 }
      );
    }

    if (
      score === undefined ||
      score === null ||
      Number(score) < 0 ||
      Number(score) > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Score must be between 0 and 100.",
        },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      UPDATE submissions
      SET
        feedback = ?,
        score = ?,
        check_status = 'approved',
        updated_at = NOW()
      WHERE submission_id = ?
      `,
      [
        feedback,
        Number(score),
        submissionId,
      ]
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

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully.",
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