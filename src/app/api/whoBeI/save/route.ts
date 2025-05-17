import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { CharacterProfile } from "@/types/base";

const PROFILE_PATH = path.resolve(
  process.cwd(),
  "src/data/characterProfiles.json"
);
const LATEST_PATH = path.resolve(process.cwd(), "src/data/latestProfile.json");

function validateProfile(profile: any): profile is CharacterProfile {
  return (
    typeof profile?.name === "string" &&
    typeof profile?.type === "string" &&
    Array.isArray(profile?.hints) &&
    typeof profile?.traits === "object"
  );
}

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json();

    if (!validateProfile(profile)) {
      return NextResponse.json(
        { error: "Invalid profile format." },
        { status: 400 }
      );
    }

    // Read existing profiles
    let profiles: CharacterProfile[] = [];
    try {
      const data = await fs.readFile(PROFILE_PATH, "utf-8");
      profiles = JSON.parse(data);
    } catch {
      // File doesn't exist yet or is empty
      profiles = [];
    }

    // Check for duplicates
    const isDuplicate = profiles.some(
      (p) => p.name.toLowerCase() === profile.name.toLowerCase()
    );

    if (isDuplicate) {
      return NextResponse.json({
        success: false,
        message: "Duplicate character profile.",
      });
    }

    // Append and save
    profiles.push(profile);
    await fs.writeFile(
      PROFILE_PATH,
      JSON.stringify(profiles, null, 2),
      "utf-8"
    );
    await fs.writeFile(LATEST_PATH, JSON.stringify(profile, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save character:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
