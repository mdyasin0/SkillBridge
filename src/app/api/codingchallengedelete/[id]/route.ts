import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Challenge id is required",
        },
        {
          status: 400,
        },
      );
    }

    const [result]: any = await db.query(
      "DELETE FROM challenges WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Challenge not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Challenge deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
