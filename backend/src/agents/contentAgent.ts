import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface DraftOutput {
  platform: "linkedin" | "instagram";
  caption: string;
}

export async function generateDraft(input: any): Promise<DraftOutput> {
  const systemPrompt = `
You are an AI Content Creation Agent operating inside a controlled system.

RULES:
- You MUST return valid JSON only.
- You MUST include all required fields.
- Do NOT include markdown, explanations, or extra text.

REQUIRED FORMAT:
{
  "platform": "linkedin" | "instagram",
  "caption": "string"
}
`;

  const userPrompt = `
Platform: ${input.platform}

Objective:
${input.objective}

Media context:
${input.mediaContext?.map(
  (m: any) => `- ${m.description}`
).join("\n") || "No media provided"}

If media is provided, naturally reference it in the caption.
Return JSON only.
`;


  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const raw = response.choices[0].message.content;

  if (!raw) {
    throw new Error("AI returned empty response");
  }

  let parsed: DraftOutput;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  if (
    !parsed ||
    typeof parsed.caption !== "string" ||
    parsed.caption.trim() === "" ||
    !parsed.platform
  ) {
    throw new Error("AI response missing required fields");
  }

  return parsed;
}
