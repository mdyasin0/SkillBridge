import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const [user]: any = await db.query(
      "SELECT status FROM users WHERE id = ?",
      [id]
    );

    if (user[0].status === "active") {
      return NextResponse.json(
        { message: "User already active" },
        { status: 400 }
      );
    }

    await db.query("UPDATE users SET status = 'active' WHERE id = ?", [id]);

    return NextResponse.json({ message: "User restored successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}