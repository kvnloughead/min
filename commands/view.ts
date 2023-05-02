// @deno-types="../app.d.ts"

import { readLines } from '../deps.ts';
import { logError } from '../utils/lib.ts';

async function view(args: Args) {
  if (args.error) {
    logError(args.error);
    return;
  }
  const { filepath } = args.path;
  const file = await Deno.open(filepath);

  const encoder = new TextEncoder();
  const newline = encoder.encode('\n');

  let isMetadata = false;

  for await (const line of readLines(file)) {
    if (!args.verbose && !isMetadata && line.startsWith('---')) {
      isMetadata = true;
      continue;
    } else if (!args.verbose && isMetadata && line.startsWith('---')) {
      isMetadata = false;
    } else if (!isMetadata) {
      const lineBytes = encoder.encode(line);
      await Deno.stdout.write(lineBytes);
      await Deno.stdout.write(newline);
    }
  }
}

export default view;
