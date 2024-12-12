// @deno-types="../app.d.ts"

import { confirmAction, logError } from "../utils/lib.ts";

async function rename(options: Options) {
  const { path, newName, category, ext } = options;
  const newBasename = `${newName}.${ext}`;
  const newCategoryAndBasename = `${category}/${newName}.${ext}`;
  try {
    if (options.error) {
      throw options.error;
    }

    const confirmRename = confirmAction(
      options.force,
      `\nRename: ${path.categoryAndBasename} to ${newCategoryAndBasename}? (yes|no): `
    );
    if (confirmRename && newName) {
      const newPath = `${path.dirpath}/${newBasename}`;
      await Deno.rename(path.filepath, newPath);
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    if (options.verbose || error.name !== "NotFound") {
      logError(error);
    }
    if (error.name === "NotFound") {
      console.error(`\nFile doesn't exist: ${path.filepath}\n`);
    }
  }
}

export default rename;
