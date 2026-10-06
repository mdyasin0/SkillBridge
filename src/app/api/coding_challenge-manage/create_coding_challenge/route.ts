import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      difficulty,
      category,
      timeLimit,
      maxAttempt,
      starterCode,
      hint,
      
      
    } = body;

    // Validation

    if (
      !title ||
      !description ||
      !difficulty ||
      !category ||
      !timeLimit ||
      !maxAttempt 
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    await db.query(
      `
      INSERT INTO challenges
      (
        title,
        description,
        difficulty,
        category,
        timeLimit,
        maxAttempt,
        starterCode,
        hint,
      
        createdBy
      )

      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        difficulty,
        category,
        timeLimit,
        maxAttempt,
        starterCode || "",
        hint || "",
       
       

        // next time user data is taken from session/user 
        1,
      ]
    );

    return NextResponse.json(
      {
        message: "Challenge created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    // console.log(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}