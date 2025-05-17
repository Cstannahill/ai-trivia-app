import { NextRequest, NextResponse } from "next/server";
import {
  getSession,
  storeSession,
  updateSession,
} from "@/lib/whoBeI/sessionStore";
import {
  isCorrectGuess,
  handleUserQuestion,
  getHint,
} from "@/lib/whoBeI/gameLogic";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, input, profile } = await req.json();
    console.log("Session ID:", sessionId);
    console.log("Input:", input);
    console.log("Profile:", profile);
    if (!sessionId || typeof input !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    var session = await getSession(sessionId);
    if (!session) {
      console.log("Session not found, creating a new one.");
      session = {
        profile,
        guesses: 0,
        usedHints: 0,
      };
      await storeSession(sessionId, session);
    }

    if (!session || !session.profile) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { guesses, usedHints } = session;

    const isGuessCorrect = isCorrectGuess(input, profile);
    const updatedGuesses = guesses + 1;

    let response: string;

    if (input.toLowerCase().includes("hint")) {
      response = getHint(profile, usedHints);
      updateSession(sessionId, { usedHints: usedHints + 1 });
    } else if (isGuessCorrect) {
      response = `🎉 Yes! You guessed it — I am **${profile.name}**! You got it in ${updatedGuesses} guesses.`;
    } else {
      response = handleUserQuestion(input, profile);
    }

    updateSession(sessionId, { guesses: updatedGuesses });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in question handler:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
