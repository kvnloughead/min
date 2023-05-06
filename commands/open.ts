// @deno-types="../app.d.ts"

async function open(options: Options) {
  const process = Deno.run({ cmd: [options.editor, options.dir] });
  await process.status();
  return;
}

export default open;
