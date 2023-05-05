// #!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { Command, parse } from './deps.ts';
import { parsePath } from './utils/lib.ts';

import edit from './commands/edit.ts';
import cat from './commands/cat.ts';
// import open from './commands/open.ts';
// import remove from './commands/remove.ts';
// import list from './commands/list.ts';

import { getUserSettings } from './config/index.ts';
import { DEFAULT_CONFIG } from './utils/constants.ts';
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
  .command('edit <filename:string>', 'Opens min page for editing.')
  .arguments('<filename:string>')
  .action((options: Options, ...args: string[]) => {
    edit({ ...options, ...config }, args);
  })
  .command('cat <filename:string>', 'Prints contents of min page to stdout.')
  .arguments('<filename:string>')
  .action(async (options: Options, ...args: string[]) => {
    options = { ...options, ...config };
    await parsePath(options, args);
    cat(options);
  });

await program.parse(Deno.args);

// #!/usr/bin/env deno run --allow-env --allow-read
// // @deno-types="./app.d.ts"

// import { parse, path } from './deps.ts';
// import edit from './commands/edit.ts';
// import cat from './commands/cat.ts';
// import open from './commands/open.ts';
// import remove from './commands/remove.ts';
// import list from './commands/list.ts';

// import { helpWriter } from './utils/HelpWriter.ts';
// import { getUserSettings } from './config/index.ts';
// import { DEFAULT_CONFIG } from './utils/constants.ts';
// import { parseCommand } from './utils/lib.ts';

// let args: Args = parse(Deno.args, {
//   boolean: ['dev', 'help', 'force', 'verbose'],
//   string: ['cfg', 'dir', 'editor', 'ext', '_'],
//   alias: {
//     category: ['c', 'cat'],
//     cfg: ['config'],
//     dir: 'd',
//     editor: 'e',
//     extension: ['x', 'ext'],
//     force: 'f',
//     help: ['h'],
//     verbose: 'v',
//   },
// });

// const settings = await getUserSettings(DEFAULT_CONFIG, args);
// args = { ...settings, ...args };

// if (args._.length === 0 || ['-h', '--help', 'help'].includes(String(args._))) {
//   helpWriter.write();
//   Deno.exit(0);
// }

// async function parsePath(args: Args) {
//   try {
//     const dirpath = path.join(args.dir, args.category);
//     const basename = `${args._[1]}.${args.extension}`;
//     const filepath = path.join(dirpath, basename);
//     const file = await Deno.open(filepath);
//     file.close();
//     args.path = { dirpath, basename, filepath, file };
//   } catch (err) {
//     args.error = err;
//   }
// }

// const command = parseCommand(args._[0]);
// switch (command) {
//   case 'edit':
//     if (!args._[1] || args.help) {
//       helpWriter.write('edit');
//     } else {
//       edit(args);
//     }
//     break;
//   case 'remove':
//     if (!args._[1] || args.help) {
//       helpWriter.write('remove');
//     } else {
//       remove(args);
//     }
//     break;
//   case 'cat':
//     if (!args._[1] || args.help) {
//       helpWriter.write('cat');
//     } else {
//       await parsePath(args);
//       cat(args);
//     }
//     break;
//   case 'list':
//     if (args.help) {
//       helpWriter.write('list');
//     } else {
//       list(args);
//     }
//     break;
//   case 'open':
//     if (args.help) {
//       helpWriter.write('open');
//     } else {
//       open(args);
//     }
//     break;
//   default:
//     console.log(`Unknown command: ${command}`);
//     Deno.exit(1);
// }
