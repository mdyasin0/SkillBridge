import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      technology,
      difficulty,
      category,
      timeLimit,
      maxAttempts,
      rewardBadge,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !technology ||
      !difficulty ||
      !category ||
      !timeLimit ||
      !maxAttempts
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    await db.query(
      `
      INSERT INTO uichallenge
      (
        title,
        description,
        technology,
        difficulty,
        category,
        timeLimit,
        maxAttempts,
        rewardBadge
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        technology,
        difficulty,
        category,
        timeLimit,
        maxAttempts,
        rewardBadge || "",
      ],
    );

    return NextResponse.json(
      {
        success: true,
        message: "UI Challenge created successfully",
      },
      {
        status: 201,
      },
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
      },
    );
  }
}
