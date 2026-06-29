import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const {
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
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !difficulty ||
      !category ||
      !allowedLanguages ||
      !timeLimit ||
      !maxAttempt ||
      !testCases
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
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
        allowedLanguages = ?,
        timeLimit = ?,
        maxAttempt = ?,
        starterCode = ?,
        hint = ?,
        rewardBadge = ?,
        testCases = ?
      WHERE id = ?
      `,
      [
        title,
        description,
        difficulty,
        category,
        JSON.stringify(allowedLanguages),
        timeLimit,
        maxAttempt,
        starterCode || "",
        hint || "",
        rewardBadge || "",
        JSON.stringify(testCases),
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Challenge not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Challenge updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

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