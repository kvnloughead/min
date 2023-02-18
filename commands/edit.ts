// @deno-types="../app.d.ts"

import { join } from 'std/path/mod.ts';

async function openFileInEditor(editor: string, filepath: string) {
  const process = Deno.run({ cmd: [editor, filepath] });
  await process.status();
}

async function edit(args: Args) {
  const filepath = join(args.dir, `${args._[1]}.${args.ext}`);
  try {
    const file = await Deno.open(filepath);
    file.close();
    openFileInEditor(args.editor, filepath);
  } catch (_err) {
    const createNew = prompt(`Would you like to create it? (yes|no): `);
    if (createNew && ['y', 'yes'].includes(createNew.toLowerCase())) {
      openFileInEditor(args.editor, filepath);
    }
  }
}

export default edit;
