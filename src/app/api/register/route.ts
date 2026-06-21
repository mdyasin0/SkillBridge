import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, photo, password, role } = body;

    //  validation (basic safety)
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    //  check if user exists
    const [existingUser]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  insert user
    await db.query(
      `INSERT INTO users (name, email, photo, role, password)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, photo || "", role || "developer", hashedPassword],
    );

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 },
    );
  }
}
