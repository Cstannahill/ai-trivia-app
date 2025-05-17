import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const model = process.env.OPENAI_MODEL || "gpt-4";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  console.log("POST");
  try {
    const body = await req.json();
    console.log("Topics: ", body);
    const date = new Date();
    const prompt = `Generate exactly 10 trivia questions. Each question should have exactly 4 possible answers. Indicate the correct answer explicitly. 
    Questions should be chosen from the following categories, 2 questions each:
    1. ${body.topics[0].topic} - Difficulty: ${body.topics[0].difficulty}
    2. ${body.topics[1].topic} - Difficulty: ${body.topics[1].difficulty}
    3. ${body.topics[2].topic} - Difficulty: ${body.topics[2].difficulty}
    4. ${body.topics[3].topic} - Difficulty: ${body.topics[3].difficulty}
    5. ${body.topics[4].topic} - Difficulty: ${body.topics[4].difficulty}

    The questions should be varied and interesting.
    If less than 5 categories are provided, fill the remaining questions with random trivia from the available categories.
    If random difficulty is selected, return the r - <easy || normal || hard> . An example would be "r-easy" or "r-hard.
    Provide the output strictly in valid JSON format. Do NOT include markdown or any code block formatting. Your response MUST look exactly like this example structure:

    {
      "questions": [
        {
          "category": "Tech",
          "question": "Which of these major tech companies made the largest single-day market value gain in history, achieving a gain of over $190 billion in market capitalization in November 2023?",
          "options": ["Microsoft", "Apple", "NVIDIA", "Tesla"],
          "answer": "NVIDIA",
          "explanation": "On November 21, 2023, NVIDIA experienced a historic surge, gaining over $190 billion in market capitalization in a single trading day, following strong earnings fueled by the continued AI boom and growth in semiconductor demand."
          "difficulty": "hard"
          "createdAt": ${date}
        }
      ]
    }`;
    console.log("Prompt:", prompt);
    const { text } = await generateText({
      model: openai.chat(model),
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // console.log("Raw AI response:", text);

    // Remove potential markdown wrapping from response
    const sanitizedText = text
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const trivia = JSON.parse(sanitizedText);

    return NextResponse.json(trivia);
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
