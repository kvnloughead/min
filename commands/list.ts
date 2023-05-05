// @deno-types="../app.d.ts"

import { path } from '../deps.ts';
import { log } from '../utils/lib.ts';

async function listFiles(
  directory: string,
  pattern?: RegExp | string,
): Promise<string[]> {
  const fileNames: string[] = [];
  const regex =
    pattern instanceof RegExp ? pattern : pattern && new RegExp(pattern);
  for await (const dirEntry of Deno.readDir(directory)) {
    const filePath = path.join(directory, dirEntry.name);
    if (dirEntry.isFile && (!regex || regex.test(dirEntry.name))) {
      fileNames.push(filePath);
    } else if (dirEntry.isDirectory) {
      const subFiles = await listFiles(filePath, pattern);
      fileNames.push(...subFiles);
    }
  }
  return fileNames;
}

async function list(options: Options, args: string[]) {
  const pattern = args[0];
  const files = await listFiles(options.dir, pattern);
  if (files.length === 0) log(`No matching files found.`);
  else {
    log(files.join('\n'));
  }
}

export default list;
