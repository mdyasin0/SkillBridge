import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      receiverName,
      receiverId,
      senderName,
      senderId,
      message,
    } = body;

    // Validation
    if (
      !receiverName ||
      !receiverId ||
      !senderName ||
      !senderId ||
      !message?.trim()
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    /*
      Check whether a conversation already exists
      between these two users.

      We check both directions so that:
      A -> B
      and
      B -> A

      are considered the same conversation.
    */

    const [existingConversation]: any = await db.query(
      `
      SELECT conversationId
      FROM conversations
      WHERE
        (senderId = ? AND receiverId = ?)
        OR
        (senderId = ? AND receiverId = ?)
      ORDER BY id ASC
      LIMIT 1
      `,
      [
        senderId,
        receiverId,
        receiverId,
        senderId,
      ],
    );

    let conversationId: string;

    if (existingConversation.length > 0) {
      // Existing conversation
      conversationId =
        existingConversation[0].conversationId;
    } else {
      // New conversation
      conversationId =
        `conversation_${senderId}_${receiverId}_${Date.now()}`;
    }

    // Insert message
    const [result]: any = await db.query(
      `
      INSERT INTO conversations
      (
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
      )

      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        NOW(),
        NOW(),
        FALSE,
        FALSE
      )
      `,
      [
        conversationId,
        receiverName,
        receiverId,
        senderName,
        senderId,
        message.trim(),
      ],
    );

    return NextResponse.json(
      {
        message: "Message sent successfully",

        data: {
          id: result.insertId,
          conversationId,
          receiverName,
          receiverId,
          senderName,
          senderId,
          message: message.trim(),
          read: false,
          edited: false,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Conversation API Error:", error);

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const otherUserId = searchParams.get("otherUserId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "userId is required",
        },
        {
          status: 400,
        },
      );
    }

    /*
      --------------------------------------------------
      CASE 1:
      userId + otherUserId

      নির্দিষ্ট দুইজনের সম্পূর্ণ conversation
      --------------------------------------------------
    */

    if (otherUserId) {
      const [messages]: any = await db.query(
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
        WHERE
          (senderId = ? AND receiverId = ?)
          OR
          (senderId = ? AND receiverId = ?)
        ORDER BY createdAt ASC, id ASC
        `,
        [
          userId,
          otherUserId,
          otherUserId,
          userId,
        ],
      );

      return NextResponse.json(
        {
          message: "Messages fetched successfully",
          data: messages,
        },
        {
          status: 200,
        },
      );
    }

    /*
      --------------------------------------------------
      CASE 2:
      শুধু userId

      Current user যেসব developer-এর সাথে message করেছে,
      প্রত্যেক developer-এর latest message + photo return করবে।
      --------------------------------------------------
    */

    const [conversations]: any = await db.query(
      `
      SELECT
        c.id,
        c.conversationId,

        c.receiverName,
        c.receiverId,

        c.senderName,
        c.senderId,

        c.message,
        c.createdAt,
        c.updatedAt,

        c.\`read\`,
        c.edited,

        /*
          Current user বাদ দিয়ে অপর user-এর ID বের করছি
        */
        CASE
          WHEN c.senderId = ? THEN c.receiverId
          ELSE c.senderId
        END AS developerId,

        /*
          developerprofiles থেকে photo
        */
        dp.photo AS developerPhoto

      FROM conversations c

      INNER JOIN (
        /*
          প্রতিটি developer-এর latest message বের করছি
        */
        SELECT
          CASE
            WHEN senderId = ? THEN receiverId
            ELSE senderId
          END AS otherUserId,

          MAX(id) AS latestId

        FROM conversations

        WHERE
          senderId = ?
          OR receiverId = ?

        GROUP BY
          CASE
            WHEN senderId = ? THEN receiverId
            ELSE senderId
          END
      ) latest

      ON c.id = latest.latestId

      /*
        Developer profile-এর সাথে JOIN
      */
      LEFT JOIN developerprofiles dp
        ON dp.userId =
          CASE
            WHEN c.senderId = ? THEN c.receiverId
            ELSE c.senderId
          END

      ORDER BY c.createdAt DESC
      `,
      [
        // SELECT → developerId
        userId,

        // INNER JOIN → CASE
        userId,

        // WHERE senderId
        userId,

        // WHERE receiverId
        userId,

        // GROUP BY CASE
        userId,

        // LEFT JOIN → developer ID
        userId,
      ],
    );

    return NextResponse.json(
      {
        message: "Conversations fetched successfully",
        data: conversations,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Get Conversation API Error:", error);

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