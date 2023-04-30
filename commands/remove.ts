// @deno-types="../app.d.ts"

import { path } from '../deps.ts';

async function remove(args: Args) {
  let dirpath, basename, filepath, file;
  try {
    dirpath = path.join(args.dir, args.category);
    basename = `${args._[1]}.${args.extension}`;
    filepath = path.join(dirpath, basename);
    file = await Deno.open(filepath);
    file.close();
    let confirm;
    if (!args.force) {
      confirm = prompt(`\nDelete: ${basename}? (yes|no): `);
    }
    if (
      args.force ||
      (confirm && ['y', 'yes'].includes(confirm.toLowerCase()))
    ) {
      await Deno.remove(filepath);
    }
  } catch (err) {
    if (err.name === 'NotFound') {
      console.error(`\nFile doesn't exist: ${basename}\n`);
    }
  }
}

export default remove;
