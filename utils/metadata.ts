// @deno-types="../app.d.ts"

import { yamlStringify } from '../deps.ts';

export function getMetadataFromOptions(options: Options) {
  return {
    category: options.category,
    author: options.author,
    tags: options.tags,
    title: options.title,
    dateCreated: new Date().toLocaleDateString(),
    dateModified: new Date().toLocaleDateString(),
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
