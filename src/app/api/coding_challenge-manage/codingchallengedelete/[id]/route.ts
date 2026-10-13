
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  _req: Request,
  { params }: Params
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

    const [result]: any = await db.query(
      "DELETE FROM challenges WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
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
        message: "Challenge deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete challenge error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete challenge. Check database constraints.",
      },
      { status: 500 }
    );
  }
}
