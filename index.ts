#!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { parse } from 'std/flags/mod.ts';
import edit from './commands/edit.ts';
import view from './commands/view.ts';
import open from './commands/open.ts';

import { help } from './utils/help.ts';
import { parseJsonFile } from './utils/helpers.ts';

const defaults = await parseJsonFile('./defaults.json');
const config = await parseJsonFile(defaults.cfg);

const args: Args = {
  ...defaults,
  ...config,
  ...parse(Deno.args, {
    string: ['cfg', 'dir', 'editor', 'ext'],
    alias: {
      editor: 'e',
      extension: ['x', 'ext'],
      dir: 'd',
      cfg: ['c', 'config'],
      help: ['h'],
    },
  }),
};

if (args._.length === 0 || ['-h', '--help', 'help'].includes(String(args._))) {
  help.app();
  Deno.exit(0);
}

const command = args._[0];
switch (command) {
  case 'edit':
    if (!args._[1] || args.help) {
      help.edit();
    } else {
      edit(args);
    }
    break;
  case 'view':
    if (!args._[1] || args.help) {
      help.view();
    } else {
      view(args);
    }
    break;
  case 'open':
    if (args.help) {
      help.open();
    } else {
      open(args);
    }
    break;
  default:
    console.log(`Unknown command: ${command}`);
    Deno.exit(1);
}
