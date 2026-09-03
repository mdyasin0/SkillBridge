import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // =========================================================
    // 1. Get all developer profiles
    // =========================================================

   const [developers]: any = await db.query(`
  SELECT
    dp.id,
    dp.userId,

    -- User information
    u.name AS name,
    u.photo AS photo,

    -- Developer profile information
    dp.title,
    dp.availability,
    dp.bio,
    dp.experienceYears,
    dp.experienceMonths,
    dp.country,
    dp.education,
    dp.skills,
    dp.techStack,
    dp.languages,
    dp.github,
    dp.portfolio

  FROM developerprofiles dp

  INNER JOIN users u
    ON u.id = dp.userId

  WHERE u.role = 'developer'
`);

    // =========================================================
    // 2. Get ranking + scoring data for all developers
    // =========================================================

    const [rankRows]: any = await db.query(`
      SELECT
        u.id,
        u.created_at,

        -- ============================================
        -- Total approved challenges
        -- ============================================

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

        -- ============================================
        -- Average score
        -- ============================================

        (
          COALESCE(
            (
              SELECT SUM(s.score)
              FROM submissions s
              WHERE s.user_id = u.id
                AND s.check_status = 'approved'
            ),
            0
          )
          +
          COALESCE(
            (
              SELECT SUM(ss.score)
              FROM solution_submit ss
              WHERE ss.user_id = u.id
                AND ss.check_status = 'approved'
            ),
            0
          )
        )
        /
        NULLIF(
          (
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
            )
          ),
          0
        ) AS average_score,

        -- ============================================
        -- Hard approved challenges
        -- ============================================

        (
          SELECT COUNT(*)
          FROM submissions s
          INNER JOIN uichallenge uc
            ON uc.id = s.challenge_id
          WHERE s.user_id = u.id
            AND s.check_status = 'approved'
            AND uc.difficulty = 'Hard'
        )
        +
        (
          SELECT COUNT(*)
          FROM solution_submit ss
          INNER JOIN challenges c
            ON c.id = ss.challenge_id
          WHERE ss.user_id = u.id
            AND ss.check_status = 'approved'
            AND c.difficulty = 'Hard'
        ) AS hard_count,

        -- ============================================
        -- Medium approved challenges
        -- ============================================

        (
          SELECT COUNT(*)
          FROM submissions s
          INNER JOIN uichallenge uc
            ON uc.id = s.challenge_id
          WHERE s.user_id = u.id
            AND s.check_status = 'approved'
            AND uc.difficulty = 'Medium'
        )
        +
        (
          SELECT COUNT(*)
          FROM solution_submit ss
          INNER JOIN challenges c
            ON c.id = ss.challenge_id
          WHERE ss.user_id = u.id
            AND ss.check_status = 'approved'
            AND c.difficulty = 'Medium'
        ) AS medium_count,

        -- ============================================
        -- Easy approved challenges
        -- ============================================

        (
          SELECT COUNT(*)
          FROM submissions s
          INNER JOIN uichallenge uc
            ON uc.id = s.challenge_id
          WHERE s.user_id = u.id
            AND s.check_status = 'approved'
            AND uc.difficulty = 'Easy'
        )
        +
        (
          SELECT COUNT(*)
          FROM solution_submit ss
          INNER JOIN challenges c
            ON c.id = ss.challenge_id
          WHERE ss.user_id = u.id
            AND ss.check_status = 'approved'
            AND c.difficulty = 'Easy'
        ) AS easy_count

      FROM users u

      WHERE u.role = 'developer'

      ORDER BY
        approved_count DESC,
        average_score DESC,
        hard_count DESC,
        medium_count DESC,
        easy_count DESC,
        u.created_at ASC
    `);

    // =========================================================
    // Completed challenges for ALL developers
    // Same calculation as single developer API
    // =========================================================

    const [completedChallengeRows]: any = await db.query(`
  SELECT
    user_id,
    COUNT(*) AS completed_count
  FROM (
    SELECT
      user_id
    FROM submissions
    WHERE status = 'submitted'

    UNION ALL

    SELECT
      user_id
    FROM solution_submit
    WHERE status = 'submitted'
  ) AS completed_challenges
  GROUP BY user_id
`);

    const completedChallengeMap = new Map<number, number>();

    completedChallengeRows.forEach((row: any) => {
      completedChallengeMap.set(
        Number(row.user_id),
        Number(row.completed_count),
      );
    });
    // =========================================================
    // 3. Create rank map
    // =========================================================

    const rankMap = new Map<number, number>();

    rankRows.forEach((developer: any, index: number) => {
      rankMap.set(Number(developer.id), index + 1);
    });

    // =========================================================
    // Calculate total verified badges for ALL developers
    // =========================================================

    const [projectBadgeRows]: any = await db.query(`
  SELECT
    s.user_id,
    uc.technology AS badge_name,
    COUNT(*) AS total_completed,
    AVG(s.score) AS average_score,
    MIN(s.score) AS lowest_score
  FROM submissions s
  INNER JOIN uichallenge uc
    ON uc.id = s.challenge_id
  WHERE s.check_status = 'approved'
    AND uc.technology IS NOT NULL
    AND uc.technology != ''
  GROUP BY
    s.user_id,
    uc.technology
`);

    const [problemBadgeRows]: any = await db.query(`
  SELECT
    ss.user_id,
    c.category AS badge_name,
    COUNT(*) AS total_completed,
    AVG(ss.score) AS average_score,
    MIN(ss.score) AS lowest_score
  FROM solution_submit ss
  INNER JOIN challenges c
    ON c.id = ss.challenge_id
  WHERE ss.check_status = 'approved'
    AND c.category IS NOT NULL
    AND c.category != ''
  GROUP BY
    ss.user_id,
    c.category
`);

    const badgeCountMap = new Map<number, number>();

    const processBadgeRows = (rows: any[]) => {
      rows.forEach((badge: any) => {
        const totalCompletedChallenges = Number(badge.total_completed ?? 0);

        const averageScore = Number(badge.average_score ?? 0);

        const lowestScore = Number(badge.lowest_score ?? 0);

        // Same verification logic as single developer API
        const verified =
          totalCompletedChallenges >= 5 &&
          averageScore >= 80 &&
          lowestScore >= 80;

        if (verified) {
          const userId = Number(badge.user_id);

          badgeCountMap.set(userId, (badgeCountMap.get(userId) ?? 0) + 1);
        }
      });
    };

    processBadgeRows(projectBadgeRows);
    processBadgeRows(problemBadgeRows);
    // =========================================================
    // 4. Get total platform challenge difficulty
    // =========================================================

    const [difficultyRows]: any = await db.query(`
      SELECT
        difficulty,
        COUNT(*) AS total
      FROM (
        SELECT difficulty
        FROM uichallenge

        UNION ALL

        SELECT difficulty
        FROM challenges
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

    // =========================================================
    // 7. Calculate overallSkillScore for every developer
    // =========================================================

    const developersWithScore = developers.map((developer: any) => {
      const userId = Number(developer.userId);

      const totalBadgeNumber = badgeCountMap.get(userId) ?? 0;

      const completedChallenges = completedChallengeMap.get(userId) ?? 0;
      // -----------------------------------------
      // Get ranking/scoring data
      // -----------------------------------------

      const rankData = rankRows.find((row: any) => Number(row.id) === userId);

      // -----------------------------------------
      // Average Score Contribution - Max 60
      // -----------------------------------------

      const averageScore = Number(rankData?.average_score ?? 0);

      const averageScoreContribution = Math.min((averageScore / 100) * 60, 60);

      // -----------------------------------------
      // Difficulty Performance - Max 25
      // -----------------------------------------

      const hardCount = Number(rankData?.hard_count ?? 0);

      const mediumCount = Number(rankData?.medium_count ?? 0);

      const easyCount = Number(rankData?.easy_count ?? 0);

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

      const difficultyContribution = Number(
        (difficultyProgress * 25).toFixed(2),
      );

      // -----------------------------------------
      // Badge Contribution - Max 15
      // -----------------------------------------

      const MAX_BADGES = 10;

      const badgeContribution = Math.min(
        (Math.min(totalBadgeNumber, MAX_BADGES) / MAX_BADGES) * 15,
        15,
      );

      // -----------------------------------------
      // Final Overall Skill Score
      // -----------------------------------------

      const overallSkillScore = Number(
        (
          averageScoreContribution +
          difficultyContribution +
          badgeContribution
        ).toFixed(2),
      );

      return {
        ...developer,

        rank: rankMap.get(userId) ?? null,
        completedChallenges,
        overallSkillScore,
        totalBadgeNumber,
        // Optional: score breakdown
        overallSkillScoreBreakdown: {
          average: Number(averageScoreContribution.toFixed(2)),

          difficulty: difficultyContribution,

          badge: Number(badgeContribution.toFixed(2)),
        },
      };
    });

    // =========================================================
    // 8. Return response
    // =========================================================

    return NextResponse.json({
      success: true,
      data: developersWithScore,
    });
  } catch (error) {
    console.error("Developer profile API error:", error);

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
