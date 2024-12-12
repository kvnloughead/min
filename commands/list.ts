// @deno-types="../app.d.ts"

import { ParsedPath, path } from "../deps.ts";
import { getFiles, log } from "../utils/lib.ts";

async function list(options: Options, args: string[]) {
  const pattern = args[0];
  const { category } = options;
  const recursive = Boolean(category === "all");
  const dir = recursive ? options.dir : path.join(options.dir, category);
  const files = await getFiles(dir, pattern, {
    recursive,
  });

  if (files.length === 0) log(`No matching files found.`);
  else {
    log(
      files
        .map((file: ParsedPath) =>
          recursive
            ? path.join(file.dir.split("/").pop(), file.name)
            : file.name
        )
        .sort()
        .join("\n"),
    );
  }
}

export default list;
