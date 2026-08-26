import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { userId, otherUserId } = body;

    /*
    ==================================================
    Validation
    ==================================================
    */

    if (!userId || !otherUserId) {
      return NextResponse.json(
        {
          message: "userId and otherUserId are required",
        },
        {
          status: 400,
        },
      );
    }

    /*
    ==================================================
    Mark messages as read
     
    userId = current user / receiver
    otherUserId = other user / sender

    তাই শুধু এই ধরনের message update হবে:

    senderId   = otherUserId
    receiverId = userId
    read       = 0

    অন্য direction-এর message update হবে না।
    ==================================================
    */

    const [result]: any = await db.query(
      `
      UPDATE conversations

      SET
        \`read\` = 1,
        updatedAt = NOW()

      WHERE
        senderId = ?
        AND receiverId = ?
        AND \`read\` = 0
      `,
      [
        otherUserId,
        userId,
      ],
    );

    return NextResponse.json(
      {
        message: "Messages marked as read successfully",

        data: {
          userId,
          otherUserId,
          updatedCount: result.affectedRows,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Mark Messages Read API Error:",
      error,
    );

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}