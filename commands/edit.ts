// @deno-types="../app.d.ts"

import { join } from 'std/path/mod.ts';

import { writeMetadataToFile } from '../utils/lib.ts';

async function openFileInEditor(editor: string, filepath: string) {
  const process = Deno.run({ cmd: [editor, filepath] });
  await process.status();
}

function getMetadata(args: Args) {
  return {
    category: args.category,
    author: args.author,
    tags: args.tags,
    dateCreated: new Date().toLocaleDateString(),
    dateModified: new Date().toLocaleDateString(),
  };
}

async function edit(args: Args) {
  const basename = `${args._[1]}.${args.extension}`;
  const filepath = join(args.dir, basename);
  try {
    const file = await Deno.open(filepath);
    file.close();
    openFileInEditor(args.editor, filepath);
  } catch (err) {
    console.log(err);
    const createNew = prompt(
      `File doesn't exist: ${basename}.\nWould like like to create it? (yes|no): `,
    );
    if (createNew && ['y', 'yes'].includes(createNew.toLowerCase())) {
      const metadata = getMetadata(args);
      await Deno.mkdir(args.dir, { recursive: true });
      await writeMetadataToFile(filepath, metadata);
      openFileInEditor(args.editor, filepath);
    }
  }
}

export default edit;
