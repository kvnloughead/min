import { join } from 'std/path/mod.ts';

async function edit(args: Args) {
  const file = join(args.minPath, `${args._[1]}.${args.ext}`);
  const process = Deno.run({ cmd: [args.editor, file] });
  await process.status();
  return;
}

export default edit;
