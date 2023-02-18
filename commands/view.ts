import { copy } from "../deps.ts";
import { join } from "std/path/mod.ts";

async function view(args: Args) {
  const filepath = join(args.minPath, `${args._[1]}.${args.ext}`);
  console.log(filepath);

  const file = await Deno.open(filepath);
  await copy(file, Deno.stdout);
  file.close();
}

export default view;
