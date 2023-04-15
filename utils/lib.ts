import { path, yamlStringify } from '../deps.ts';

export async function writeMetadataToFile(
  filepath: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  Object.keys(metadata).forEach(
    (key) => metadata[key] === undefined && delete metadata[key],
  );
  await Deno.writeTextFile(filepath, `---\n${yamlStringify(metadata)}---`);
}

export async function parseJsonFile(filepath: string): Promise<Args> {
  const data = await Deno.readFile(filepath);
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(data);
  return JSON.parse(text);
}

export function addUserDir(filepath: string) {
  const home = Deno.env.get('HOME') || '';
  return path.join(home, filepath);
}
