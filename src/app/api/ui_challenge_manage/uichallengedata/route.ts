import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(
      `
      SELECT *
      FROM uichallenge
      ORDER BY id DESC
      `
    );

    return NextResponse.json(
      {
        success: true,
        count: rows.length,
        data: rows,
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