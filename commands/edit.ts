// @deno-types="../app.d.ts"

import { join } from 'std/path/mod.ts';

import { writeMetadataToFile } from '../utils/helpers.ts';

async function openFileInEditor(editor: string, filepath: string) {
  const process = Deno.run({ cmd: [editor, filepath] });
  await process.status();
}

function getMetadata(args: Args) {
  return {
    category: args.category,
    author: args.author,
    tags: args.tags,
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };
}

async function edit(args: Args) {
  const filepath = join(args.dir, `${args._[1]}.${args.extension}`);
  try {
    const file = await Deno.open(filepath);
    file.close();
    openFileInEditor(args.editor, filepath);
  } catch (_err) {
    const createNew = prompt(`Would you like to create it? (yes|no): `);
    if (createNew && ['y', 'yes'].includes(createNew.toLowerCase())) {
      const metadata = getMetadata(args);
      await writeMetadataToFile(filepath, metadata);
      openFileInEditor(args.editor, filepath);
    }
  }
}

export default edit;
