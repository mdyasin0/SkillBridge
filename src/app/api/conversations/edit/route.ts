import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { messageId, userId, message } = body;

    /*
    ==================================================
    Validation
    ==================================================
    */

    if (!messageId || !userId || typeof message !== "string") {
      return NextResponse.json(
        {
          message: "messageId, userId and message are required",
        },
        {
          status: 400,
        },
      );
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return NextResponse.json(
        {
          message: "Message cannot be empty",
        },
        {
          status: 400,
        },
      );
    }

    /*
    ==================================================
    Find Message
    ==================================================

    messageId দিয়ে নির্দিষ্ট message খুঁজছি।
    */

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        senderId,
        receiverId,
        message,
        createdAt,
        updatedAt,
        edited

      FROM conversations

      WHERE id = ?
      LIMIT 1
      `,
      [messageId],
    );

    /*
    ==================================================
    Message Not Found
    ==================================================
    */

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          message: "Message not found",
        },
        {
          status: 404,
        },
      );
    }

    const existingMessage = rows[0];

    /*
    ==================================================
    Authorization
    ==================================================

    শুধু message-এর original sender
    নিজের message edit করতে পারবে।

    অন্য user's message edit করা যাবে না।
    */

    if (String(existingMessage.senderId) !== String(userId)) {
      return NextResponse.json(
        {
          message: "You can only edit your own messages",
        },
        {
          status: 403,
        },
      );
    }

    /*
    ==================================================
    Update Message
    ==================================================

    message
    edited = 1
    updatedAt = NOW()

    createdAt পরিবর্তন করছি না।
    */

    const [result]: any = await db.query(
      `
      UPDATE conversations

      SET
        message = ?,
        edited = 1,
        updatedAt = NOW()

      WHERE
        id = ?
        AND senderId = ?
      `,
      [
        trimmedMessage,
        messageId,
        userId,
      ],
    );

    /*
    ==================================================
    Update Failed
    ==================================================
    */

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Message update failed",
        },
        {
          status: 400,
        },
      );
    }

    /*
    ==================================================
    Fetch Updated Message
    ==================================================

    Database থেকে updated data আবার নিয়ে আসছি।
    এতে frontend exact database value পাবে।
    */

    const [updatedRows]: any = await db.query(
      `
      SELECT
        id,
        conversationId,
        receiverName,
        receiverId,
        senderName,
        senderId,
        message,
        createdAt,
        updatedAt,
        \`read\`,
        edited

      FROM conversations

      WHERE id = ?
      LIMIT 1
      `,
      [messageId],
    );

    /*
    ==================================================
    Success
    ==================================================
    */

    return NextResponse.json(
      {
        message: "Message edited successfully",

        data: updatedRows[0],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Edit Message API Error:",
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