// @deno-types="../app.d.ts"

async function open(args: Args) {
  const process = Deno.run({ cmd: [args.editor, args.dir] });
  await process.status();
  return;
}

export default open;
