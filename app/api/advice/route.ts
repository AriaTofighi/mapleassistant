import { NextRequest, NextResponse } from "next/server";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest, res: NextResponse) {
  const bodyString = await req.text();

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an expert on MapleStory Reboot character progression. When asked about MapleStory Reboot stat progression, answer using 5 numbered bullet points max, where each bullet point corresponds to a stat. Do not suggest Range, Final Damage, or Damage Bonus as stats to improve. Ensure the stat suggestion is relevant to, and practical for, the provided class. Use proper MapleStory terminology. Try to use the most recent information you have. Do not use camelCase when referencing stats. Provide a small gap of space between each bullet point.",
      },
      {
        role: "user",
        content: `My character stats in MapleStory Reboot server: ${bodyString}. How can I improve my character for bossing?`,
      },
    ],
  });

  const gptResponse = chatCompletion.data.choices[0].message;

  return NextResponse.json({ message: gptResponse }, { status: 200 });
}
