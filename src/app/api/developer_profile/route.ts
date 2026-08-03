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
        },
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
      [userId],
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
      [userId],
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
      [userId],
    );

    // completed and pending challenges  count start
    const [[challengeStats]]: any = await db.query(
      `
  SELECT
    (
      SELECT COUNT(*)
      FROM submissions
      WHERE user_id = ?
      AND status = 'submitted'
    ) +
    (
      SELECT COUNT(*)
      FROM solution_submit
      WHERE user_id = ?
      AND status = 'submitted'
    ) AS totalCompletedChallenges,

    (
      SELECT COUNT(*)
      FROM submissions
      WHERE user_id = ?
      AND status = 'pending'
    ) +
    (
      SELECT COUNT(*)
      FROM solution_submit
      WHERE user_id = ?
      AND status = 'pending'
    ) AS totalPendingChallenges
  `,
      [userId, userId, userId, userId],
    );

    // completed challenges count end

  //  success rate system start

  const [[successRate]]: any = await db.query(
  `
  SELECT
    (
      (
        (
          SELECT COUNT(*)
          FROM submissions
          WHERE user_id = ?
            AND check_status = 'approved'
            AND score >= 80
        )
        +
        (
          SELECT COUNT(*)
          FROM solution_submit
          WHERE user_id = ?
            AND check_status = 'approved'
            AND score >= 80
        )
      ) * 100.0
    )
    /
    NULLIF(
      (
        (
          SELECT COUNT(*)
          FROM submissions
          WHERE user_id = ?
            AND check_status = 'approved'
        )
        +
        (
          SELECT COUNT(*)
          FROM solution_submit
          WHERE user_id = ?
            AND check_status = 'approved'
        )
      ),
      0
    ) AS success_rate
  `,
  [userId, userId, userId, userId],
);


// succes rate system end






  // Average Challenge Scores start
const [[averageChallengeScore]]: any = await db.query(
  `
  SELECT
    (
      COALESCE(
        (
          SELECT SUM(score)
          FROM submissions
          WHERE user_id = ?
          AND check_status = 'approved'
        ),
        0
      )
      /
      NULLIF(
        (
          SELECT COUNT(*)
          FROM submissions
          WHERE user_id = ?
          AND check_status = 'approved'
        ),
        0
      )
    ) AS project_challenge_average_score,

    (
      COALESCE(
        (
          SELECT SUM(score)
          FROM solution_submit
          WHERE user_id = ?
          AND check_status = 'approved'
        ),
        0
      )
      /
      NULLIF(
        (
          SELECT COUNT(*)
          FROM solution_submit
          WHERE user_id = ?
          AND check_status = 'approved'
        ),
        0
      )
    ) AS problem_solving_average_score
  `,
  [userId, userId, userId, userId],
);
// Average Challenge Scores end
    

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
    const calculateBadges = (rows: any[], type: "project" | "problem") => {
      const approvedRows = rows.filter((item) => {
        return item.check_status === "approved";
      });
      const grouped: Record<string, any[]> = {};

      approvedRows.forEach((item) => {
        const badgeName = type === "project" ? item.technology : item.category;

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
          scores.reduce((sum, score) => sum + score, 0) / scores.length;

        const lowestScore = Math.min(...scores);

        const reviewStatus = true; // approved filter করা হয়েছে

        const minimumCompleted = totalCompletedChallenges >= 5;

        const averageCompleted = averageScore >= 80;

        const minimumScore = lowestScore >= 80;

        const verified =
          reviewStatus && minimumCompleted && averageCompleted && minimumScore;

        return {
          badgeName,
          totalCompletedChallenges,
          averageScore: Number(averageScore.toFixed(2)),
          minimumScore: minimumScore,
          reviewStatus,
          verified,
        };
      });
    };

    const projectBadges = calculateBadges(submissions, "project");

    const problemBadges = calculateBadges(solutions, "problem");
    const totalBadgeNumber = [...projectBadges, ...problemBadges].filter(
      (badge) => badge.verified,
    ).length;
    // badge system end
    // ======================================
    // Total Platform Challenge Difficulty start
    // ======================================

    const [difficultyRows]: any = await db.query(`
SELECT
  difficulty,
  COUNT(*) AS total
FROM (
    SELECT difficulty FROM uichallenge
    UNION ALL
    SELECT difficulty FROM challenges
) AS all_challenges
GROUP BY difficulty
`);

    const totalEasy = Number(
      difficultyRows.find((row: any) => row.difficulty === "Easy")?.total ?? 0,
    );

    const totalMedium = Number(
      difficultyRows.find((row: any) => row.difficulty === "Medium")?.total ??
        0,
    );

    const totalHard = Number(
      difficultyRows.find((row: any) => row.difficulty === "Hard")?.total ?? 0,
    );

    // ======================================
    // Total Platform Challenge Difficulty end
    // ======================================
    // ===============================
    // Overall Skill Score start
    // ===============================

    // Average Score (Max 60)
    const averageScore = Number(rankRows[rank - 1]?.average_score ?? 0);

    const averageScoreContribution = Math.min((averageScore / 100) * 60, 60);

    // Difficulty Performance (Max 25)

    const hardCount = rankRows[rank - 1]?.hard_count ?? 0;
    const mediumCount = rankRows[rank - 1]?.medium_count ?? 0;
    const easyCount = rankRows[rank - 1]?.easy_count ?? 0;
    const easyProgress = Math.min(
      totalEasy === 0 ? 0 : easyCount / totalEasy,
      1,
    );

    const mediumProgress = Math.min(
      totalMedium === 0 ? 0 : mediumCount / totalMedium,
      1,
    );

    const hardProgress = Math.min(
      totalHard === 0 ? 0 : hardCount / totalHard,
      1,
    );
    const EASY_PERCENT = 0.2;
    const MEDIUM_PERCENT = 0.3;
    const HARD_PERCENT = 0.5;

    const difficultyProgress =
      easyProgress * EASY_PERCENT +
      mediumProgress * MEDIUM_PERCENT +
      hardProgress * HARD_PERCENT;

    const difficultyContribution = Number((difficultyProgress * 25).toFixed(2));
    // Badge Score (Max 15)

    const MAX_BADGES = 10;

    const badgeContribution = Math.min(
      (Math.min(totalBadgeNumber, MAX_BADGES) / MAX_BADGES) * 15,
      15,
    );

    // Final Overall Skill Score

    const overallSkillScore = Number(
      (
        averageScoreContribution +
        difficultyContribution +
        badgeContribution
      ).toFixed(2),
    );
    // ===============================
    // Overall Skill Score end
    // ===============================
    return NextResponse.json({
      success: true,
      completedChallenges: challengeStats?.totalCompletedChallenges ?? 0,

      pendingChallenges: challengeStats?.totalPendingChallenges ?? 0,
    project_challenge_average_score: Number(
  averageChallengeScore?.project_challenge_average_score ?? 0,
).toFixed(2),

problem_solving_average_score: Number(
  averageChallengeScore?.problem_solving_average_score ?? 0,
).toFixed(2),
successRate: Number(
  successRate?.success_rate ?? 0
).toFixed(2),
      data: profile,

      ranking: {
        rank,
        totalDevelopers: rankRows.length,
        approved: rankRows[rank - 1]?.approved_count ?? 0,
        averageScore: Number(rankRows[rank - 1]?.average_score ?? 0).toFixed(2),
        hard: rankRows[rank - 1]?.hard_count ?? 0,
        medium: rankRows[rank - 1]?.medium_count ?? 0,
        easy: rankRows[rank - 1]?.easy_count ?? 0,
      },
      badgeSystem: {
        totalBadgeNumber,
        projectBadges,
        problemBadges,
      },

      overallSkillScore: {
        score: overallSkillScore,
        maxScore: 100,

        breakdown: {
          average: Number(averageScoreContribution.toFixed(2)),

          difficulty: difficultyContribution,

          badge: Number(badgeContribution.toFixed(2)),
        },
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
      },
    );
  }
}
