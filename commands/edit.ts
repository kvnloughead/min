// @deno-types="../app.d.ts"

import { path } from '../deps.ts';

import { confirmAction, writeMetadataToFile } from '../utils/lib.ts';

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
  let dirpath, basename, filepath, file;
  try {
    dirpath = path.join(args.dir, args.category);
    basename = `${args._[1]}.${args.extension}`;
    filepath = path.join(dirpath, basename);
    file = await Deno.open(filepath);
    file.close();
    openFileInEditor(args.editor, filepath);
  } catch (err) {
    if (err.name === 'NotFound') {
      const confirm = confirmAction(
        args.force,
        `File doesn't exist: ${basename}.\nWould like like to create it? (yes|no): `,
      );
      if (confirm) {
        const metadata = getMetadata(args);
        await Deno.mkdir(dirpath, { recursive: true });
        await writeMetadataToFile(filepath, metadata);
        openFileInEditor(args.editor, filepath);
      }
    }
  }
}
// }

export default edit;
