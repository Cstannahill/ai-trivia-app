import { NextRequest, NextResponse } from "next/server";
import {
  chooseRandomProfile,
  generateNewProfile,
  appendCharacterProfile,
} from "@/lib/whoBeI/characterProfiles";
import type { CharacterProfile } from "@/types/base";

export async function POST(request: NextRequest) {
  let profile: CharacterProfile;
  try {
    var { useGenerated = false, threadId } = await request.json();
    console.log(threadId, "Thread ID from request");
    if (!threadId) {
      threadId = crypto.randomUUID();
    }

    if (useGenerated) {
      const result = await generateNewProfile(threadId);
      profile = result.profile;
      threadId = result.threadId;
      await appendCharacterProfile(profile);
    } else {
      profile = await chooseRandomProfile();
    }

    return NextResponse.json({ profile, threadId });
  } catch (error) {
    console.error("Failed to start game:", error);
    return NextResponse.json(
      { error: "Could not start game.", details: error },
      { status: 500 }
    );
  }
}
