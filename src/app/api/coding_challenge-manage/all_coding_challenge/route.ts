import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        id,
        title,
        description,
        difficulty,
        category,
        allowedLanguages,
        timeLimit,
        maxAttempt,
        starterCode,
        hint,
        rewardBadge,
        testCases,
        createdBy,
        createdAt
      FROM challenges
      ORDER BY id DESC
    `);

    // JSON string গুলো parse করা
    const challenges = rows.map((challenge: any) => ({
      ...challenge,
      allowedLanguages: JSON.parse(challenge.allowedLanguages || "[]"),
      testCases: JSON.parse(challenge.testCases || "[]"),
    }));

    return NextResponse.json(
      {
        success: true,
        data: challenges,
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