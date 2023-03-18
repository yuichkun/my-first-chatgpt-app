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

async function* readLines(): AsyncIterable<string> {
  const decoder = new TextDecoder();
  const buffer = new Uint8Array(1024);

  while (true) {
    const bytesRead = await Deno.stdin.read(buffer);
    if (bytesRead === null) {
      break;
    }
    const line = decoder.decode(buffer.subarray(0, bytesRead)).trim();
    if (line) {
      yield line;
    }
  }
}

async function main() {
  console.log(
    "ChatGPTに質問してください (終了するには'q'を入力してください)："
  );
  let input = "";

  while (input.toLowerCase() !== "q") {
    Deno.stdout.writeSync(new TextEncoder().encode("質問: "));
    for await (const line of readLines()) {
      input = line;
      break;
    }
    if (input && input.toLowerCase() !== "q") {
      const response = await generateResponse(input);
      console.log(`回答: ${response}`);
    }
  }

  console.log("アプリケーションを終了します。");
}

main();
