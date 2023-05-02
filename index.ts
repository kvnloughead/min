#!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { parse, path } from './deps.ts';
import edit from './commands/edit.ts';
import cat from './commands/cat.ts';
import open from './commands/open.ts';
import remove from './commands/remove.ts';
import list from './commands/list.ts';

import { helpWriter } from './utils/HelpWriter.ts';
import { getUserSettings } from './config/index.ts';
import { DEFAULT_CONFIG } from './utils/constants.ts';
import { parseCommand } from './utils/lib.ts';

let args: Args = parse(Deno.args, {
  boolean: ['dev', 'help', 'force', 'verbose'],
  string: ['cfg', 'dir', 'editor', 'ext', '_'],
  alias: {
    category: ['c', 'cat'],
    cfg: ['config'],
    dir: 'd',
    editor: 'e',
    extension: ['x', 'ext'],
    force: 'f',
    help: ['h'],
    verbose: 'v',
  },
});

const settings = await getUserSettings(DEFAULT_CONFIG, args);
args = { ...settings, ...args };

if (args._.length === 0 || ['-h', '--help', 'help'].includes(String(args._))) {
  helpWriter.write();
  Deno.exit(0);
}

async function parsePath(args: Args) {
  try {
    const dirpath = path.join(args.dir, args.category);
    const basename = `${args._[1]}.${args.extension}`;
    const filepath = path.join(dirpath, basename);
    const file = await Deno.open(filepath);
    file.close();
    args.path = { dirpath, basename, filepath, file };
  } catch (err) {
    args.error = err;
  }
}

const command = parseCommand(args._[0]);
switch (command) {
  case 'edit':
    if (!args._[1] || args.help) {
      helpWriter.write('edit');
    } else {
      edit(args);
    }
    break;
  case 'remove':
    if (!args._[1] || args.help) {
      helpWriter.write('remove');
    } else {
      remove(args);
    }
    break;
  case 'cat':
    if (!args._[1] || args.help) {
      helpWriter.write('cat');
    } else {
      await parsePath(args);
      cat(args);
    }
    break;
  case 'list':
    if (args.help) {
      helpWriter.write('list');
    } else {
      list(args);
    }
    break;
  case 'open':
    if (args.help) {
      helpWriter.write('open');
    } else {
      open(args);
    }
    break;
  default:
    console.log(`Unknown command: ${command}`);
    Deno.exit(1);
}
