// @deno-types="../app.d.ts"

import { confirmAction, writeMetadataToFile, logError } from '../utils/lib.ts';

async function openFileInEditor(editor: string, filepath: string) {
  const cmd = new Deno.Command(editor, { args: [filepath] });
  const child = cmd.spawn();
  await child.status;
}

function getMetadata(options: Options) {
  return {
    category: options.category,
    author: options.author,
    tags: options.tags,
    dateCreated: new Date().toLocaleDateString(),
    dateModified: new Date().toLocaleDateString(),
  };
}

async function edit(options: Options) {
  const { filepath, dirpath, categoryAndBasename } = options.path;

  try {
    if (options.error) {
      throw options.error;
    }
    openFileInEditor(options.editor, filepath);
  } catch (err) {
    if (options.verbose || err.name !== 'NotFound') {
      logError(err);
    }
    if (err.name === 'NotFound') {
      const confirmCreateNew = confirmAction(
        options.force,
        `File doesn't exist: ${categoryAndBasename}.\nWould you like to create it? (yes|no): `,
      );
      if (confirmCreateNew) {
        const metadata = getMetadata(options);
        await Deno.mkdir(dirpath, { recursive: true });
        await writeMetadataToFile(filepath, metadata);
        openFileInEditor(options.editor, filepath);
      }
    }
  }
}

export default edit;
