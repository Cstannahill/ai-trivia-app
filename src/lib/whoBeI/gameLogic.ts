import { CharacterProfile } from "@/types/base";

/**
 * Matches a user's yes/no input against traits in the character profile.
 */
export function handleUserQuestion(
  input: string,
  profile: CharacterProfile
): string {
  const normalized = input.toLowerCase().trim();

  // --- 1. Direct match against known keys like "type"
  if (
    normalized.includes("fictional") &&
    profile.type.toLowerCase() !== "fictional character"
  ) {
    return "No.";
  }
  if (
    normalized.includes("historical") &&
    profile.type.toLowerCase() === "historical figure"
  ) {
    return "Yes.";
  }
  if (
    normalized.includes("celebrity") &&
    profile.type.toLowerCase() === "celebrity"
  ) {
    return "Yes.";
  }

  // --- 2. Match against traits
  for (const [key, value] of Object.entries(profile.traits)) {
    if (typeof value === "boolean") {
      if (normalized.includes(key.toLowerCase())) {
        return value ? "Yes." : "No.";
      }
    }

    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      console.log("Checking value:", v, "against input:", normalized);
      if (typeof v === "string" && normalized.includes(v.toLowerCase())) {
        console.log("Match found:", v, "input:", normalized);
        return "Yes.";
      }
    }
  }

  // --- 3. Fallback: Match keywords
  if (
    profile.keywords?.some((kw) => {
      const match = normalized.includes(kw.toLowerCase());
      console.log("Checking keyword:", kw, "against input:", normalized);
      if (match) {
        console.log("Keyword match found:", kw, "input:", normalized);
      }
      return match;
    })
  ) {
    return "Yes.";
  }

  // --- 4. Last resort
  return "I'm not sure. Try asking about a profession, known work, or era.";
}

/**
 * Returns the next available hint, or informs the user they've used all.
 */
export function getHint(profile: CharacterProfile, usedHints: number): string {
  if (usedHints >= profile.hints.length) {
    return "You've used all your available hints.";
  }
  return `Hint: ${profile.hints[usedHints]}`;
}

// Simple NLP helpers
function cleanInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

export function isCorrectGuess(
  input: string,
  profile: CharacterProfile
): boolean {
  if (!profile?.name || typeof profile.name !== "string") return false;

  const cleanedInput = cleanInput(input);
  const cleanedName = cleanInput(profile.name);

  // Must be framed as a guess
  const guessKeywords = ["identity"];
  const isGuessFramed = guessKeywords.some((kw) => cleanedInput.startsWith(kw));

  // Try to extract guess from sentence
  const nameParts = cleanedName.split(" ").filter((part) => part.length > 0);
  const lastName =
    nameParts.length > 1 ? nameParts[nameParts.length - 1] : cleanedName;
  const firstName = nameParts.length > 0 ? nameParts[0] : cleanedName;

  const includesFullName = cleanedInput.includes(cleanedName);
  const includesLastName = cleanedInput.includes(lastName.toLowerCase());
  const includesFirstName = cleanedInput.includes(firstName.toLowerCase());

  return (
    isGuessFramed && (includesFullName || includesLastName || includesFirstName)
  );
}
