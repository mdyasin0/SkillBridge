import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [users]: any = await db.query(
      "SELECT id, name, email, photo, role, status, created_at FROM users"
    );

    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error,
      },
      { status: 500 }
    );
  }
}