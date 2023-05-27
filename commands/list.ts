// @deno-types="../app.d.ts"

import { log } from '../utils/lib.ts';
import { listFiles } from '../utils/lib.ts';

async function list(options: Options, args: string[]) {
  const pattern = args[0];
  const files = await listFiles(options.dir, options, pattern);
  if (files.length === 0) log(`No matching files found.`);
  else {
    log(files.sort().join('\n'));
  }
}

export default list;
