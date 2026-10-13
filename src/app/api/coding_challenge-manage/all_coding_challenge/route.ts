
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
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
    `);

    return NextResponse.json(
      {
        success: true,
        data: rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch coding challenges:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch coding challenges",
      },
      { status: 500 }
    );
  }
}
