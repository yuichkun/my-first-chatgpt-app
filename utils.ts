export async function* readLines(): AsyncIterable<string> {
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
