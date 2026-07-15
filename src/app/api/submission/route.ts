import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, challengeId, challengeType } = body;

    if (!userId || !challengeId || !challengeType) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // Check if user already has any running challenge
    const [runningChallenges]: any = await db.query(
      `
      SELECT submission_id
      FROM submissions
      WHERE user_id = ?
      AND status = 'pending'
      `,
      [userId]
    );

    if (runningChallenges.length > 0) {
      return NextResponse.json(
        {
          message: `You already have ${runningChallenges.length} running challenge${
            runningChallenges.length > 1 ? "s" : ""
          }. Please submit ${
            runningChallenges.length > 1 ? "them" : "it"
          } before starting a new challenge.`,
          runningCount: runningChallenges.length,
        },
        {
          status: 409,
        }
      );
    }

    // Create submission
    const [result]: any = await db.query(
      `
      INSERT INTO submissions
      (
        user_id,
        challenge_id,
        challenge_type,
        start_time,
        status
      )
      VALUES
      (?, ?, ?, NOW(), ?)
      `,
      [userId, challengeId, challengeType, "pending"]
    );

    return NextResponse.json(
      {
        message: "Challenge started successfully.",
        submissionId: result.insertId,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}