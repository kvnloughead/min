// #!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { Command, CompletionsCommand, parse } from './deps.ts';

import edit from './commands/edit.ts';
import cat from './commands/cat.ts';
import remove from './commands/remove.ts';
import list from './commands/list.ts';
import open from './commands/open.ts';
import grep from './commands/grep.ts';

import { getConfig } from './config/index.ts';
import { parsePath, getFiles } from './utils/lib.ts';
import { DEFAULT_CONFIG, DEFAULT_DIR } from './utils/constants.ts';

const config = await getConfig(
  DEFAULT_CONFIG,
  parse(Deno.args, {
    boolean: ['dev', 'force', 'help', 'force'],
    alias: {
      category: 'c',
      cfg: 'config',
      dir: 'd',
      editor: 'e',
      extension: ['x', 'ext'],
      force: 'f',
      help: 'h',
      verbose: 'v',
    },
  }),
);

const program = new Command();
program
  .name('min')
  .version('0.1.0')
  .description('A minimal note-taking app and man page supplement.')
  .globalOption('--dev', 'Run in development mode.')
  .globalOption('-c, --category <category>', 'Category to place min page in.', {
    default: 'notes',
  })
  .globalOption('--cfg, --config <file>', 'Configuration file to use.', {
    default: DEFAULT_CONFIG,
  })
  .globalOption('-d, --dir <dir>', 'Directory to store min pages in.', {
    default: DEFAULT_DIR,
  })
  .globalOption('-e, --editor <editor>', 'Editor to open min pages with.', {
    default: `vim`,
  })
  .globalOption('--ext, --extension <ext>', 'Extension of file to create.', {
    default: `md`,
  })
  .globalOption('-f, --force', 'Take action without confirmation.')
  .globalOption('-v, --verbose', 'Provides verbose logging.')
  .globalComplete('files', async () => {
    const dir = config.dir + config.category;
    const files = await getFiles(dir);
    return files.map((file) => file.name);
  })
  // edit subcommand
  .command('e, edit <filename>', 'Opens min page for editing.')
  .arguments('<filename:string:files>')
  .option(
    '--title <title>',
    "Title for the min page. For use with something like a blog post, that would have a title that's distinct from its filename.",
  )
  .option('-t, --tags <tags...>', 'One or more single-word tags.')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    edit(options);
  })
  // cat subcommand
  .command('c, cat <filename>', 'Prints contents of min page to stdout.')
  .arguments('<filename:string:files>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    cat(options);
  })
  // remove subcommand
  .command('rm, r, remove <filename>', 'Deletes min page.')
  .arguments('<filename:string:files>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    remove(options);
  })
  .command(
    'ls, l, list [pattern]',
    'Lists min pages, with optional pattern matching.',
  )
  .option(
    '-c, --category <category>',
    'Category to include in search. Set to `all` to include all categories.',
    {
      default: 'notes',
    },
  )
  .arguments('[pattern]')
  .action((options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    list(options, args);
  })
  .command(
    'g, grep <pattern>',
    'Greps through min pages, using `grep -inr --color=auto` by default.',
  )
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    grep(options, args);
  })
  .command('o, open', 'Opens min directory in your chosen edit.')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    open(options);
  });

await program.command('completions', new CompletionsCommand()).parse(Deno.args);
