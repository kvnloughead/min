// @deno-types="../app.d.ts"

async function open(options: Options) {
  const process = new Deno.Command(options.editor, { args: [options.dir] });
  const child = process.spawn();
  await child.status;
  return;
}

export default open;
