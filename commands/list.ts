// @deno-types="../app.d.ts"

import { ParsedPath } from 'https://deno.land/std@0.183.0/path/_interface.ts';
import { getFiles } from '../utils/lib.ts';
import { log } from '../utils/lib.ts';

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
