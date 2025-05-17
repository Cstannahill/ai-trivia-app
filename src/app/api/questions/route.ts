import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
const mapFormat = (q: any) => {
  console.log("Mapping question:", q);
  return {
    question: q.question,
    options: q.options,
    answer: q.answer,
    category: q.category, // optional, adjust according to your schema
    explanation: q.explanation, // optional, adjust according to your schema
    difficulty: q.difficulty, // optional, adjust according to your schema
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body:", body);

    if (!body.questions || !Array.isArray(body.questions)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const formattedQuestions = body.questions.map(mapFormat);

    const result = await prisma.question.createMany({
      data: formattedQuestions,
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    console.error(err, "Error in POST /api/questions");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        question: true,
        options: true,
        answer: true,
        category: true,
        explanation: true,
        difficulty: true,
        createdAt: true,
      },
    });
    console.log("Fetched questions:", questions);
    return NextResponse.json(questions, { status: 200 });
  } catch (err) {
    console.error(err, "Error in GET /api/questions");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
