// @deno-types="../app.d.ts"

async function grep(options: Options, args: string[]) {
  const { category, dir, path } = options;
  const pattern = args[0];
  const cmd = new Deno.Command("grep", {
    args: [
      "-inr",
      "--color=auto",
      pattern,
      category === "all" ? dir : path.dirpath,
    ],
  });
  const child = cmd.spawn();
  await child.status;
}

export default grep;
