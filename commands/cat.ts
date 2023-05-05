// @deno-types="../app.d.ts"

import { readLines } from '../deps.ts';
import { logError } from '../utils/lib.ts';

async function cat(options: Options) {
  if (options.error) {
    logError(options.error);
    return;
  }
  const { filepath } = options.path;
  const file = await Deno.open(filepath);

  const encoder = new TextEncoder();
  const newline = encoder.encode('\n');

  let isMetadata = false;

  for await (const line of readLines(file)) {
    if (!options.verbose && !isMetadata && line.startsWith('---')) {
      isMetadata = true;
      continue;
    } else if (!options.verbose && isMetadata && line.startsWith('---')) {
      isMetadata = false;
    } else if (!isMetadata) {
      const lineBytes = encoder.encode(line);
      await Deno.stdout.write(lineBytes);
      await Deno.stdout.write(newline);
    }
  }
}

export default cat;
