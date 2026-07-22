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
        {
          status: 400,
        }
      );
    }

 
    // Create challenge session
    const [result]: any = await db.query(
      `
      INSERT INTO solution_submit
      (
        user_id,
        challenge_id,
        start_time,
        check_status,
        submit_attempts
      )
      VALUES
      (?, ?, NOW(), 'pending', 1)
      `,
      [userId, challengeId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Challenge started successfully.",
        solutionId: result.insertId,
      },
      {
        status: 201,
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