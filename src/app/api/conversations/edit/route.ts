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

     finding specific message by messageId .
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

    just  message original sender
      edits his own messages .

    others user's message is not edited 
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

    again brought updated data from Database.
    for this frontend exact database value can be found.
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