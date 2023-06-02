// @deno-types="../app.d.ts"

import { yamlStringify } from '../deps.ts';

function getTime(date: Date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString();
}

export function getMetadataFromOptions(options: Options) {
  return {
    category: options.category,
    author: options.author,
    tags: options.tags,
    title: options.title,
    date: getTime(new Date()),
  };
}

export async function writeMetadataToFile(
  filepath: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  Object.keys(metadata).forEach(
    (key) => metadata[key] === undefined && delete metadata[key],
  );
  await Deno.writeTextFile(filepath, `---\n${yamlStringify(metadata)}---`);
}
