// @deno-types="../app.d.ts"

import { copy } from '../deps.ts';
import { join } from 'std/path/mod.ts';

async function view(args: Args) {
  const filepath = join(args.dir, `${args._[1]}.${args.extension}`);
  const file = await Deno.open(filepath);
  await copy(file, Deno.stdout);
  file.close();
}

export default view;
