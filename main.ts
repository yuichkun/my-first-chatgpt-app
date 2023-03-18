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

function replacePlaceholders(prompt: string, args: string[]): string {
  let index = 0;
  return prompt.replace(/\$\$/g, () => args[index++] || "");
}

async function main() {
  if (Deno.args.length === 0) {
    console.error("Error: No filename provided.");
    Deno.exit(1);
  }

  const fileName = Deno.args[0];
  const inputArgs = Deno.args.slice(1);

  let input = await Deno.readTextFile(fileName);
  input = replacePlaceholders(input, inputArgs);
  console.log("Input: ", input);
  const response = await generateResponse(input);
  console.log(`Output: ${response}`);
}

main();
