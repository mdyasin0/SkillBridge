import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    // Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not authenticated",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check recruiter profile
    const [rows]: any = await db.query(
      `
      SELECT id
      FROM recruiterprofile
      WHERE userId = ?
      LIMIT 1
      `,
      [userId]
    );

    const profileCompleted = rows.length > 0;

    return NextResponse.json(
      {
        success: true,
        profileCompleted,
        hasProfile: profileCompleted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recruiter profile check error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}