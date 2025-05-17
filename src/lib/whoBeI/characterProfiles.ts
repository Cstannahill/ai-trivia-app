import fs from "fs";
import path from "path";
import { CharacterProfile } from "@/types/base";
import { openai } from "@/lib/openai";
import type { RunStatus } from "openai/resources/beta/threads/runs/runs.mjs";
import { isValidJSON } from "../utils";

type GenerateProfileProps = {
  threadId?: string;
};

const PROFILE_PATH = path.resolve(
  process.cwd(),
  "src/data/characterProfiles.json"
);

export async function generateNewProfile(
  props: GenerateProfileProps = {}
): Promise<{
  profile: CharacterProfile;
  threadId: string;
}> {
  let threadId = props.threadId;
  let thread;

  if (!threadId) {
    console.log("Generating new profile...");
    thread = await openai.beta.threads.create();
    threadId = thread.id;
  } else {
    console.log("Generating new profile with thread ID:", threadId);
  }

  // Step 1: Add the message
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content:
      "Generate a new WhoBeI character profile and return it as JSON. Do not include any explanations or markdown formatting. Return ONLY the JSON object.",
  });

  // Step 2: Start the run
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID!,
  });

  // Step 3: Poll run status
  let status: RunStatus = run.status;
  while (!["completed", "failed", "cancelled"].includes(status)) {
    const currentRun = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id
    );
    status = currentRun.status;
    console.log("Current run status:", status);
    await new Promise((res) => setTimeout(res, 1000));
  }

  // Step 4: Retrieve response message
  const messages = await openai.beta.threads.messages.list(threadId);
  const final = messages.data.find((m) => m.role === "assistant");

  if (!final || !final.content || final.content.length === 0) {
    throw new Error("Assistant did not return a message.");
  }

  const contentBlock = final.content[0];
  if (contentBlock.type !== "text") {
    throw new Error("Expected text content from assistant.");
  }

  let clean = contentBlock.text.value.trim();

  // Strip ```json blocks
  if (!isValidJSON(clean) && clean.startsWith("```")) {
    clean = clean
      .replace(/^```json[\s\n]*/i, "")
      .replace(/```[\s\n]*$/, "")
      .trim();
  }

  // Still not valid? Try to extract only the JSON block
  if (!isValidJSON(clean)) {
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace >= 0) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }
  }

  // Final cleanup
  clean = clean
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\'/g, "'")
    .replace(/\“|\”/g, '"')
    .replace(/\‘|\’/g, "'");

  // Validate and parse
  try {
    if (isValidJSON(clean)) {
      const parsed = JSON.parse(clean) as CharacterProfile;

      // Ensure core structure
      if (
        !parsed.name ||
        !parsed.type ||
        !Array.isArray(parsed.hints) ||
        typeof parsed.traits !== "object"
      ) {
        throw new Error("Profile is structurally invalid.");
      }

      // Remove nested traits if exists
      if ("traits" in parsed.traits) {
        delete parsed.traits["traits"];
      }

      return { profile: parsed, threadId };
    } else {
      throw new Error("Cleaned content is not valid JSON.");
    }
  } catch (err) {
    console.error("Invalid JSON from assistant:", clean);
    throw new Error("Failed to parse assistant's character profile.");
  }
}

export async function chooseRandomProfile(): Promise<CharacterProfile> {
  const file = await fs.promises.readFile(PROFILE_PATH, { encoding: "utf-8" });
  const profiles: CharacterProfile[] = JSON.parse(file);

  if (!profiles || profiles.length === 0) {
    throw new Error("No character profiles available.");
  }

  const index = Math.floor(Math.random() * profiles.length);
  console.log(profiles[index], "Choosing random profile");
  return profiles[index];
}

export async function appendCharacterProfile(profile: CharacterProfile) {
  const file = await fs.promises.readFile(PROFILE_PATH, "utf-8");
  const profiles: CharacterProfile[] = JSON.parse(file);

  const alreadyExists = profiles.some(
    (p) => p.name.toLowerCase() === profile.name.toLowerCase()
  );

  if (alreadyExists) {
    console.log(`Skipping duplicate profile: ${profile.name}`);
    return;
  }

  profiles.push(profile);

  await fs.promises.writeFile(
    PROFILE_PATH,
    JSON.stringify(profiles, null, 2),
    "utf-8"
  );

  console.log(`Appended new profile: ${profile.name}`);
}
export async function getLatestProfile(): Promise<CharacterProfile> {
  const file = await fs.promises.readFile(PROFILE_PATH, "utf-8");
  const profiles: CharacterProfile[] = JSON.parse(file);

  if (!profiles || profiles.length === 0) {
    throw new Error("No character profiles found.");
  }

  return profiles[profiles.length - 1];
}
