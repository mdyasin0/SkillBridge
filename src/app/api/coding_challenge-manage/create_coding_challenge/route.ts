import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
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

    await db.query(
      `
      INSERT INTO challenges
      (
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
        createdBy
      )

      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

        // পরে login করলে session/user থেকে নিবে
        1,
      ]
    );

    return NextResponse.json(
      {
        message: "Challenge created successfully",
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