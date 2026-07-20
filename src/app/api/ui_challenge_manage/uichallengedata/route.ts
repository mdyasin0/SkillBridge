import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and status are required.",
        },
        {
          status: 400,
        },
      );
    }

    // -----------------------------
    // Count Query
    // -----------------------------
    const [[counts]]: any = await db.query(
      `
      SELECT
        (
          SELECT COUNT(*)
          FROM uichallenge
          WHERE id NOT IN (
            SELECT challenge_id
            FROM submissions
            WHERE user_id = ?
              AND challenge_type = 'project'
          )
        ) AS available,

        (
          SELECT COUNT(*)
          FROM submissions
          WHERE user_id = ?
            AND challenge_type = 'project'
            AND status = 'pending'
        ) AS running,

        (
          SELECT COUNT(*)
          FROM submissions
          WHERE user_id = ?
            AND challenge_type = 'project'
            AND status = 'submitted'
        ) AS completed,
         
         (
  SELECT COUNT(*)
  FROM submissions
  WHERE user_id = ?
    AND challenge_type = 'project'
    AND resubmit_started_at IS NOT NULL
    AND resubmit_submitted_at IS NULL
) AS runningResubmission
      `,
      [userId, userId, userId, userId],
    );

    let rows: any[] = [];

    // -----------------------------
    // Data Query
    // -----------------------------
    if (status === "available") {
      const [result]: any = await db.query(
        `
        SELECT *
        FROM uichallenge
        WHERE id NOT IN (
          SELECT challenge_id
          FROM submissions
          WHERE user_id = ?
            AND challenge_type = 'project'
        )
        ORDER BY id DESC
        `,
        [userId],
      );

      rows = result;
    } else if (status === "running-resubmission") {
      const [result]: any = await db.query(
        `
    SELECT
      u.*,
      s.*
    FROM submissions s
    INNER JOIN uichallenge u
      ON s.challenge_id = u.id
    WHERE s.user_id = ?
      AND s.challenge_type = 'project'
      AND s.resubmit_started_at IS NOT NULL
      AND s.resubmit_submitted_at IS NULL
    ORDER BY s.resubmit_started_at DESC
    `,
        [userId],
      );

      rows = result;
    } else {
      const [result]: any = await db.query(
        `
        SELECT
          u.*,
          s.*
        FROM submissions s
        INNER JOIN uichallenge u
          ON s.challenge_id = u.id
        WHERE s.user_id = ?
          AND s.challenge_type = 'project'
          AND s.status = ?
        ORDER BY s.start_time DESC
        `,
        [userId, status],
      );

      rows = result;
    }

    return NextResponse.json(
      {
        success: true,
        data: rows,
        meta: {
          counts: {
            available: Number(counts.available),
            running: Number(counts.running),
            completed: Number(counts.completed),
            runningResubmission: Number(counts.runningResubmission),
          },
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
