// app/api/users/ban/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const [user]: any = await db.query(
      "SELECT status FROM users WHERE id = ?",
      [id]
    );

    if (!user.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user[0].status === "banned") {
      return NextResponse.json(
        { message: "User already banned" },
        { status: 400 }
      );
    }

    await db.query("UPDATE users SET status = 'banned' WHERE id = ?", [id]);

    return NextResponse.json({ message: "User banned successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}