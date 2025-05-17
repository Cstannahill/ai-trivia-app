import { CharacterProfile } from "@/types/base";
import { SessionData } from "@/types/base";

const sessionMap = new Map<string, SessionData>();

/**
 * Store a new game session in memory.
 */
export async function storeSession(sessionId: string, data: SessionData) {
  console.log("Storing Session");
  var { profile, guesses, usedHints } = await data;
  console.log(profile, "Storing profile");
  if (!sessionId) {
    throw new Error("Session ID is required");
  }
  sessionMap.set(sessionId, {
    profile,
    guesses: 0,
    usedHints: 0,
  });
  console.log(sessionMap);
}

/**
 * Get an existing session.
 */
export function getSession(sessionId: string): SessionData | undefined {
  console.log("Getting Session");
  return sessionMap.get(sessionId);
}

/**
 * Update an existing session (if needed).
 */
export function updateSession(
  sessionId: string,
  updates: Partial<SessionData>
) {
  console.log("Updating Session");
  const session = sessionMap.get(sessionId);
  if (session) {
    sessionMap.set(sessionId, { ...session, ...updates });
  }
}

/**
 * Clear a session (e.g., after game ends).
 */
export function deleteSession(sessionId: string) {
  console.log("Deleting Session");
  sessionMap.delete(sessionId);
}
