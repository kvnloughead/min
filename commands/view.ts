// @deno-types="../app.d.ts"

import { copy, path } from '../deps.ts';

async function view(args: Args) {
  const filepath = path.join(args.dir, `${args._[1]}.${args.extension}`);
  const file = await Deno.open(filepath);
  await copy(file, Deno.stdout);
  file.close();
}

export default view;
