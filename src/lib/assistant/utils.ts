import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

export async function handleFunctionCall(
  toolCall: RequiredActionFunctionToolCall
): Promise<string> {
  const { name, arguments: argsString } = toolCall.function;

  if (name === "save_character_profile") {
    const args = JSON.parse(argsString);
    const response = await fetch("/api/whoBeI/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: args.profile }),
    });

    const result = await response.json();
    return JSON.stringify(result);
  }

  return "Tool not supported.";
}
