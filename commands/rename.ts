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
    if (options.verbose || err.name !== "NotFound") {
      logError(err);
    }
    if (err.name === "NotFound") {
      console.error(`\nFile doesn't exist: ${path.filepath}\n`);
    }
  }
}

export default rename;
