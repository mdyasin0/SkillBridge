
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid challenge ID",
        },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        title,
        description,
        difficulty,
        category,
        timeLimit,
        maxAttempt,
        starterCode,
        hint,
        createdBy,
        createdAt
      FROM challenges
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Challenge not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch challenge details:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch challenge details",
      },
      { status: 500 }
    );
  }
}
