import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    await db.query(
      "UPDATE users SET status = 'suspended' WHERE id = ?",
      [id]
    );

    return NextResponse.json({ message: "User suspended successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}