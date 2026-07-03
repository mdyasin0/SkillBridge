// app/api/users/delete/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "User deleted permanently" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}