import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const { solutionId, submitCode } = await req.json();

    if (!solutionId || !submitCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Solution ID and code are required",
        },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      UPDATE solution_submit
      SET
        submitCode = ?,
        submitted_at = NOW(),
        updated_at = NOW()
      WHERE id = ?
      `,
      [submitCode, solutionId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Solution not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Solution submitted successfully",
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