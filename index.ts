// #!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { Command, CompletionsCommand, parse, path } from './deps.ts';

import edit from './commands/edit.ts';
import cat from './commands/cat.ts';
import remove from './commands/remove.ts';
import list from './commands/list.ts';
import open from './commands/open.ts';

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
  .command('edit <filename>', 'Opens min page for editing.')
  .arguments('<filename:string:files>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    edit(options);
  })
  // cat subcommand
  .command('cat <filename>', 'Prints contents of min page to stdout.')
  .arguments('<filename:string:files>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    cat(options);
  })
  // remove subcommand
  .command('remove <filename>', 'Deletes min page.')
  .arguments('<filename:string:files>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    remove(options);
  })
  // list subcommand
  .command('list [pattern]', 'Lists min pages, with optional pattern matching')
  .arguments('[pattern]')
  .action((options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    list(options, args);
  })
  // open submcommand
  .command('open')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    open(options);
  });

await program.command('completions', new CompletionsCommand()).parse(Deno.args);
