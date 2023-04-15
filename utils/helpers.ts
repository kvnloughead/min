import {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from 'https://deno.land/std@0.82.0/encoding/yaml.ts';

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
