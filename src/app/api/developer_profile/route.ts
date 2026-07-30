import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const [[profile]]: any = await db.query(
  `
  SELECT
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    u.photo AS user_photo,
    u.status AS user_status,
    u.created_at AS user_created_at,

    dp.id AS developer_profile_id,
    dp.photo AS developer_photo,
    dp.fullName,
    dp.bio,
    dp.experienceYears,
    dp.experienceMonths,
    dp.country,
    dp.education,
    dp.skills,
    dp.techStack,
    dp.languages,
    dp.github,
    dp.portfolio,
    dp.linkedin,
    dp.created_at AS developer_created_at,
    dp.updated_at AS developer_updated_at

  FROM users u
  LEFT JOIN developerprofiles dp
  ON dp.userId = u.id

  WHERE u.id = ?
  `,
  [userId]
);
const [submissions]: any = await db.query(
  `
  SELECT
    s.*,
    uc.technology,
    uc.difficulty
  FROM submissions s
  LEFT JOIN uichallenge uc
    ON uc.id = s.challenge_id
  WHERE s.user_id = ?
  ORDER BY s.created_at DESC
  `,
  [userId]
);

const [solutions]: any = await db.query(
  `
  SELECT
    ps.*,
    c.category,
    c.difficulty
  FROM solution_submit ps
  LEFT JOIN challenges c
    ON c.id = ps.challenge_id
  WHERE ps.user_id = ?
  ORDER BY ps.created_at DESC
  `,
  [userId]
);
    // ranks system start

    const [rankRows]: any = await db.query(`
SELECT
    u.id,
    u.created_at,

    (
        SELECT COUNT(*)
        FROM submissions s
        WHERE s.user_id = u.id
        AND s.check_status = 'approved'
    )
    +
    (
        SELECT COUNT(*)
        FROM solution_submit ss
        WHERE ss.user_id = u.id
        AND ss.check_status = 'approved'
    ) AS approved_count,

    (
        COALESCE(
            (
                SELECT SUM(score)
                FROM submissions s
                WHERE s.user_id = u.id
                AND s.check_status='approved'
            ),
            0
        )
        +
        COALESCE(
            (
                SELECT SUM(score)
                FROM solution_submit ss
                WHERE ss.user_id = u.id
                AND ss.check_status='approved'
            ),
            0
        )
    ) /
    NULLIF(
        (
            (
                SELECT COUNT(*)
                FROM submissions s
                WHERE s.user_id=u.id
                AND s.check_status='approved'
            )
            +
            (
                SELECT COUNT(*)
                FROM solution_submit ss
                WHERE ss.user_id=u.id
                AND ss.check_status='approved'
            )
        ),
        0
    ) AS average_score,

    (
        SELECT COUNT(*)
        FROM submissions s
        INNER JOIN uichallenge uc
            ON uc.id = s.challenge_id
        WHERE s.user_id=u.id
        AND s.check_status='approved'
        AND uc.difficulty='Hard'
    )
    +
    (
        SELECT COUNT(*)
        FROM solution_submit ss
        INNER JOIN challenges c
            ON c.id = ss.challenge_id
        WHERE ss.user_id=u.id
        AND ss.check_status='approved'
        AND c.difficulty='Hard'
    ) AS hard_count,

    (
        SELECT COUNT(*)
        FROM submissions s
        INNER JOIN uichallenge uc
            ON uc.id = s.challenge_id
        WHERE s.user_id=u.id
        AND s.check_status='approved'
        AND uc.difficulty='Medium'
    )
    +
    (
        SELECT COUNT(*)
        FROM solution_submit ss
        INNER JOIN challenges c
            ON c.id = ss.challenge_id
        WHERE ss.user_id=u.id
        AND ss.check_status='approved'
        AND c.difficulty='Medium'
    ) AS medium_count,

    (
        SELECT COUNT(*)
        FROM submissions s
        INNER JOIN uichallenge uc
            ON uc.id = s.challenge_id
        WHERE s.user_id=u.id
        AND s.check_status='approved'
        AND uc.difficulty='Easy'
    )
    +
    (
        SELECT COUNT(*)
        FROM solution_submit ss
        INNER JOIN challenges c
            ON c.id = ss.challenge_id
        WHERE ss.user_id=u.id
        AND ss.check_status='approved'
        AND c.difficulty='Easy'
    ) AS easy_count

FROM users u

ORDER BY
approved_count DESC,
average_score DESC,
hard_count DESC,
medium_count DESC,
easy_count DESC,
u.created_at ASC
`);
const rank =
  rankRows.findIndex((item: any) => item.id == Number(userId)) + 1;
//   ranks system end
//  badge system start
    const calculateBadges = (
  rows: any[],
  type: "project" | "problem"
) => {
const approvedRows = rows.filter((item) => {
  return item.check_status === "approved";
});
  const grouped: Record<string, any[]> = {};

  approvedRows.forEach((item) => {
    const badgeName =
      type === "project"
        ? item.technology
        : item.category;

    if (!badgeName) return;

    if (!grouped[badgeName]) {
      grouped[badgeName] = [];
    }

    grouped[badgeName].push(item);
  });

  return Object.entries(grouped).map(([badgeName, list]) => {
const scores = list.map((item) => Number(item.score));

    const totalCompletedChallenges = list.length;

    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) /
      scores.length;

    const minimumScore = Math.min(...scores);

    const reviewStatus = true; // approved filter করা হয়েছে

    const minimumCompleted =
      totalCompletedChallenges >= 5;

    const averageCompleted =
      averageScore >= 80;

    const successRate =
      minimumScore >= 80;

    const verified =
      reviewStatus &&
      minimumCompleted &&
      averageCompleted &&
      successRate;

    return {
      badgeName,
      totalCompletedChallenges,
      averageScore: Number(
        averageScore.toFixed(2)
      ),
      successRate: minimumScore,
      reviewStatus,
      verified,
    };
  });
};

const projectBadges = calculateBadges(
  submissions,
  "project"
);

const problemBadges = calculateBadges(
  solutions,
  "problem"
);
const totalBadgeNumber =
  [...projectBadges, ...problemBadges].filter(
    (badge) => badge.verified
  ).length;
// badge system end 
    return NextResponse.json({
      success: true,
      data: profile,
     ranking: {
    rank,
    totalDevelopers: rankRows.length,
    approved: rankRows[rank - 1]?.approved_count ?? 0,
    averageScore: Number(
      rankRows[rank - 1]?.average_score ?? 0
    ).toFixed(2),
    hard: rankRows[rank - 1]?.hard_count ?? 0,
    medium: rankRows[rank - 1]?.medium_count ?? 0,
    easy: rankRows[rank - 1]?.easy_count ?? 0,
  },
       badgeSystem: {
    totalBadgeNumber,
    projectBadges,
    problemBadges,
  },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}