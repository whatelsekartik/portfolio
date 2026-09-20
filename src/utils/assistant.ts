import { backendPost } from "./backend";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Sends the conversation to the Apps Script backend, which holds the Groq API key
 * and forwards the request. The key never reaches the browser.
 */
export async function askAssistant(messages: ChatMessage[], context: string): Promise<string> {
  let data: { ok?: boolean; reply?: string; error?: string };
  try {
    data = await backendPost({ action: "chat", messages: JSON.stringify(messages), context });
  } catch {
    throw new Error("Couldn't reach the assistant. Check your connection and try again.");
  }
  if (!data.ok || !data.reply) throw new Error(data.error || "The assistant didn't answer. Please try again.");
  return data.reply;
}
