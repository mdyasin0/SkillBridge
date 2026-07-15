import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and status are required.",
        },
        {
          status: 400,
        }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT u.*
      FROM submissions s
      INNER JOIN uichallenge u
      ON s.challenge_id = u.id
      WHERE s.user_id = ?
      AND s.challenge_type = 'project'
      AND s.status = ?
      ORDER BY s.start_time DESC
      `,
      [userId, status]
    );

    return NextResponse.json(
      {
        success: true,
        data: rows,
      },
      {
        status: 200,
      }
    );
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