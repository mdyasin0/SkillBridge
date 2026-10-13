
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";
    const photo =
      typeof body.photo === "string" ? body.photo : "";
    const role =
      typeof body.role === "string" && body.role.trim()
        ? body.role.trim()
        : "developer";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    const [existingUsers]: any = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name, email, photo, role, password, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, photo, role, hashedPassword, "active"]
    );

    return NextResponse.json(
      { message: "User created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
