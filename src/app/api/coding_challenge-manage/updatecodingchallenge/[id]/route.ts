import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid challenge ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      difficulty,
      category,
      timeLimit,
      maxAttempt,
      starterCode,
      hint,
    } = body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !difficulty ||
      !category ||
      timeLimit == null ||
      maxAttempt == null
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      UPDATE challenges
      SET
        title = ?,
        description = ?,
        difficulty = ?,
        category = ?,
        timeLimit = ?,
        maxAttempt = ?,
        starterCode = ?,
        hint = ?
      WHERE id = ?
      `,
      [
        title,
        description,
        difficulty,
        category,
        Number(timeLimit),
        Number(maxAttempt),
        starterCode || "",
        hint || "",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      // affectedRows 0 হলে record নেই, অথবা কোনো value পরিবর্তন হয়নি।
      const [rows]: any = await db.query(
        "SELECT id FROM challenges WHERE id = ? LIMIT 1",
        [id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { success: false, message: "Challenge not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Challenge updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update challenge error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update challenge" },
      { status: 500 }
    );
  }
}