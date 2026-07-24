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

      ON DUPLICATE KEY UPDATE
        start_time = start_time,
        check_status = 'pending'
      `,
      [userId, challengeId]
    );


    // Existing row হলে id পাওয়া যাবে না, তাই id বের করছি
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
        message: "Challenge started successfully.",
        solutionId: rows[0].id,
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