// @deno-types="../app.d.ts"

import { ParsedPath } from '../deps.ts';
import { getFiles, log } from '../utils/lib.ts';

async function list(options: Options, args: string[]) {
  const pattern = args[0];
  const files = await getFiles(`${options.dir}/${options.category}`, pattern);
  if (files.length === 0) log(`No matching files found.`);
  else {
    log(
      files
        .map((file: ParsedPath) => file.name)
        .sort()
        .join('\n'),
    );
  }
}

export default list;
