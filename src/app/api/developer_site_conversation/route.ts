import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

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
      ==================================================
      Developer Inbox

      userId = current Developer

      আমরা প্রতিটি conversation-এর জন্য:

      1. Latest message
      2. Other user / Recruiter
      3. Recruiter photo
      4. Current Developer receiver ID
      5. Unread message count

      বের করছি।
      ==================================================
    */

    const [conversations]: any = await db.query(
      `
      SELECT

        c.conversationId,

        /*
          ----------------------------------------------
          Current logged-in Developer ID
          
          এই conversation-এ read API call করার সময়
          receiverId হিসেবে ব্যবহার করা যাবে।
          ----------------------------------------------
        */

        ? AS receiverId,

        /*
          ----------------------------------------------
          Opposite user / Recruiter ID
          ----------------------------------------------
        */

        CASE
          WHEN c.senderId = ? THEN c.receiverId
          ELSE c.senderId
        END AS otherUserId,

        /*
          ----------------------------------------------
          Opposite user / Recruiter Name
          ----------------------------------------------
        */

        CASE
          WHEN c.senderId = ? THEN c.receiverName
          ELSE c.senderName
        END AS otherUserName,

        /*
          ----------------------------------------------
          Recruiter profile photo
          ----------------------------------------------
        */

        rp.profilephoto AS recruiterPhoto,

        /*
          ----------------------------------------------
          Latest message
          ----------------------------------------------
        */

        c.message AS lastMessage,

        c.createdAt AS lastMessageAt,

        c.id AS lastMessageId,

        c.read,

        c.edited,

        /*
          ----------------------------------------------
          UNREAD COUNT

          শুধু:

          Recruiter → Developer
          read = 0

          এই message-গুলো count হবে।
          ----------------------------------------------
        */

        (
          SELECT COUNT(*)

          FROM conversations unread

          WHERE
            unread.conversationId = c.conversationId

            AND unread.senderId != ?

            AND unread.receiverId = ?

            AND unread.\`read\` = 0

        ) AS unreadCount

      FROM conversations c

      /*
        ----------------------------------------------
        প্রতিটি conversation-এর latest message
        ----------------------------------------------
      */

      INNER JOIN (
        SELECT
          conversationId,
          MAX(id) AS latestId

        FROM conversations

        WHERE
          senderId = ?
          OR receiverId = ?

        GROUP BY conversationId

      ) latest

      ON c.id = latest.latestId

      /*
        ----------------------------------------------
        Recruiter profile JOIN
        ----------------------------------------------
      */

      LEFT JOIN recruiterprofile rp

        ON rp.user_id =
          CASE
            WHEN c.senderId = ? THEN c.receiverId
            ELSE c.senderId
          END

      /*
        Latest conversation আগে
        */

      ORDER BY c.id DESC
      `,
      [
        /*
          SELECT → receiverId
          Current Developer
        */
        userId,

        /*
          SELECT → otherUserId
        */
        userId,

        /*
          SELECT → otherUserName
        */
        userId,

        /*
          unreadCount → senderId != current Developer
        */
        userId,

        /*
          unreadCount → receiverId = current Developer
        */
        userId,

        /*
          INNER JOIN → senderId
        */
        userId,

        /*
          INNER JOIN → receiverId
        */
        userId,

        /*
          LEFT JOIN → recruiter profile
        */
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
    console.error(
      "Get Developer Conversation API Error:",
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