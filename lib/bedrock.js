const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

// Any Bedrock-hosted model works here. Default assumes Claude via Bedrock;
// swap BEDROCK_MODEL_ID in .env to use a different model (e.g. Amazon Nova,
// Llama, Mistral) without touching this code.
const MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20241022-v2:0";

/**
 * Generates a spoken-style meeting briefing using Bedrock, grounded in the
 * meeting's attendees/docs, and aware of prior conversation turns so the
 * user can ask natural follow-ups ("who else is joining?").
 */
async function generateBriefing({ meeting, conversationHistory, userQuery }) {
  const contextBlock = meeting
    ? `
Meeting: ${meeting.title}
Company: ${meeting.company}
Time: ${meeting.time}
Attendees:
${meeting.attendees
  .map((a) => `- ${a.name}, ${a.role} at ${a.company}. Last interaction: ${a.lastInteraction}`)
  .join("\n")}
Related documents:
${meeting.relatedDocs.map((d) => `- ${d.title}: ${d.summary}`).join("\n")}
`.trim()
    : "No specific meeting is currently loaded in context.";

  const systemPrompt = `You are a voice-first meeting prep assistant, simulating an Alexa+ experience.
Respond the way a helpful spoken assistant would: concise, conversational, no markdown, no bullet symbols.
Only use the meeting context provided below -- do not invent attendees, companies, or facts not listed.
If the user asks something the context doesn't cover, say you don't have that information yet.

Meeting context:
${contextBlock}`;

  const messages = [
    ...conversationHistory.map((turn) => ({
      role: turn.role === "assistant" ? "assistant" : "user",
      content: [{ text: turn.content }],
    })),
    { role: "user", content: [{ text: userQuery }] },
  ];

  const command = new ConverseCommand({
    modelId: MODEL_ID,
    system: [{ text: systemPrompt }],
    messages,
    inferenceConfig: { maxTokens: 400, temperature: 0.4 },
  });

  const response = await client.send(command);
  return response.output.message.content[0].text;
}

module.exports = { generateBriefing };
