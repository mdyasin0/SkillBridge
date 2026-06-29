import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
        }
      );
    }

    const [result]: any = await db.query(
      `
      UPDATE uichallenge
      SET
        title = ?,
        description = ?,
        technology = ?,
        difficulty = ?,
        category = ?,
        timeLimit = ?,
        maxAttempts = ?,
        rewardBadge = ?
      WHERE id = ?
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
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Challenge not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
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
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
