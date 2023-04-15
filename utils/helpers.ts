export async function parseJsonFile(filepath: string): Promise<Args> {
  const data = await Deno.readFile(filepath);
  const decoder = new TextDecoder("utf-8");
  const text = decoder.decode(data);
  return JSON.parse(text);
}
