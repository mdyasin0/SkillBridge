import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      `
      SELECT
        c.id,
        c.title,
        c.description,
        c.difficulty,
        c.category,
        c.timeLimit,
        c.maxAttempt,
        c.starterCode,
        c.hint,

        c.createdBy,
        c.createdAt
      FROM challenges c
      ORDER BY c.id DESC
      `
    );

    const allChallenges = rows.map((item: any) => ({
      ...item,
    }));

    return NextResponse.json({
      success: true,
      count: allChallenges.length,
      data: allChallenges,
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