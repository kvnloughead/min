// @deno-types="../app.d.ts"

import { path } from '../deps.ts';
import { log } from '../utils/lib.ts';

/**
 * Retrieves a list of files from a directory based on the specified pattern.
 *
 * Assumes a structure such that all files files in the directory are inside
 * subdirectories, and those subdirectories represent categories.
 *
 * The category and basename will both be listed.
 * If -v is set, the entire file path will be listed.
 *
 *@param {string} directory - The directory path to search for files.
 *@param {Options} options - The options object containing additional configurations.
 *@param {RegExp | string} [pattern] - The pattern used to filter files. Defaults to undefined.
 *@returns {Promise<string[]>} - A promise that resolves to an array of file names.
 */
async function listFiles(
  directory: string,
  options: Options,
  pattern?: RegExp | string,
): Promise<string[]> {
  const files: string[] = [];
  const regex =
    pattern instanceof RegExp ? pattern : pattern && new RegExp(pattern);
  for await (const dirEntry of Deno.readDir(directory)) {
    const filePath = path.join(directory, dirEntry.name);
    if (dirEntry.isFile && (!regex || regex.test(dirEntry.name))) {
      files.push(
        options.verbose
          ? filePath
          : `${options.currentCategory}/${dirEntry.name}`,
      );
    } else if (dirEntry.isDirectory) {
      options.currentCategory = dirEntry.name;
      const subFiles = await listFiles(filePath, options, pattern);
      files.push(...subFiles);
    }
  }
  return files;
}

async function list(options: Options, args: string[]) {
  const pattern = args[0];
  const files = await listFiles(options.dir, options, pattern);
  if (files.length === 0) log(`No matching files found.`);
  else {
    log(files.sort().join('\n'));
  }
}

export default list;
