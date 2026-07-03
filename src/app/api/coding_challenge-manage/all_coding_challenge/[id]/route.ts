import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await db.query(
      "SELECT * FROM challenges WHERE id=?",
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          message: "Challenge not found",
        },
        {
          status: 404,
        }
      );
    }

    const challenge = {
      ...rows[0],
      allowedLanguages: JSON.parse(
        rows[0].allowedLanguages || "[]"
      ),
      testCases: JSON.parse(
        rows[0].testCases || "[]"
      ),
    };

    return NextResponse.json(challenge);
  } catch (err) {
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