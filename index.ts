// #!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { Command, parse } from './deps.ts';

import edit from './commands/edit.ts';
import cat from './commands/cat.ts';
import remove from './commands/remove.ts';
import list from './commands/list.ts';
// import open from './commands/open.ts';

import { getUserSettings } from './config/index.ts';
import { DEFAULT_CONFIG } from './utils/constants.ts';
import { parsePath } from './utils/lib.ts';
const config = await getUserSettings(DEFAULT_CONFIG, parse(Deno.args));

const program = new Command();
program
  .name('min')
  .version('0.1.0')
  .description('A minimal note-taking app and man page supplement.')
  .globalOption('--dev', 'Run in development mode.')
  .globalOption('-c, --category', 'Category to place min page in.')
  .globalOption('--cfg, --config', 'Configuration file to use.')
  .globalOption('-d, --dir', 'Directory to store min pages in.')
  .globalOption('-e, --editor', 'Editor to open min pages with.')
  .globalOption('--ext, --extension', 'Extension of file to create.')
  .globalOption('-f, --force', 'Take action without confirmation.')
  .globalOption('-v, --verbose', 'Provides verbose logging.')
  // edit subcommand
  .command('edit <filename>', 'Opens min page for editing.')
  .arguments('<filename>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    edit(options);
  })
  // cat subcommand
  .command('cat <filename>', 'Prints contents of min page to stdout.')
  .arguments('<filename>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    cat(options);
  })
  // remove subcommand
  .command('remove <filename>', 'Deletes min page.')
  .arguments('<filename>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    remove(options);
  })
  // list subcommand
  .command('list [pattern]', 'Lists min pages, with optional pattern matching')
  .arguments('[pattern]')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    list(options, args);
  });

await program.parse(Deno.args);
