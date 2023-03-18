import { OpenAI } from "https://deno.land/x/openai/mod.ts";

const key = Deno.env.get("OPENAI_API_KEY");
if (!key) throw new Error("OPENAI_API_KEY not set");
const openai = new OpenAI(key);

async function generateResponse(prompt: string) {
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return result.choices[0].message.content;
}

async function main() {
  let input = "";
  console.log("Input: ", input);
  const response = await generateResponse(input);
  console.log(`Output: ${response}`);
}

main();
