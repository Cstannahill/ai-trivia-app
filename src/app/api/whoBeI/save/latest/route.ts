import { getLatestProfile } from "@/lib/whoBeI/characterProfiles";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await getLatestProfile();
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read latest profile" },
      { status: 404 }
    );
  }
}
