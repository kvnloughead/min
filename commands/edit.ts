// @deno-types="../app.d.ts"

import { confirmAction, logError } from "../utils/lib.ts";
import {
  getMetadataFromOptions,
  writeMetadataToFile,
} from "../utils/metadata.ts";

async function openFileInEditor(editor: string, filepath: string) {
  try {
    const cmd = new Deno.Command(editor, { args: [filepath] });
    const child = cmd.spawn();
    await child.status;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      throw new Error(
        `Editor '${editor}' not found. Please check your editor setting.`
      );
    }
    throw err;
  }
}

async function edit(options: Options) {
  const { filepath, dirpath, categoryAndBasename } = options.path;

  try {
    if (options.error) {
      throw options.error;
    }
    // Check if the file exists
    try {
      await Deno.stat(filepath);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        const confirmCreateNew = confirmAction(
          options.force,
          `File doesn't exist: ${categoryAndBasename}.\nWould you like to create it? (yes|no): `
        );
        if (confirmCreateNew) {
          const metadata = getMetadataFromOptions(options);
          await Deno.mkdir(dirpath, { recursive: true });
          await Deno.writeTextFile(filepath, "");
          await writeMetadataToFile(filepath, metadata);
        } else {
          return;
        }
      } else {
        throw err;
      }
    }
    // If file exists, open it in the editor
    await openFileInEditor(options.editor, filepath);
  } catch (err) {
    // Only show stack trace for unexpected errors
    if (err.message?.includes("Editor") || options.verbose) {
      console.error(err.message);
    } else {
      logError(err);
    }
  }
}

export default edit;
