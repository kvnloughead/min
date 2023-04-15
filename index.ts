#!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { parse } from './deps.ts';
import edit from './commands/edit.ts';
import view from './commands/view.ts';
import open from './commands/open.ts';

import { help } from './utils/help.ts';
import { getUserSettings } from './utils/config.ts';

const settings = await getUserSettings(`./defaults.json`);

console.log(settings);

const args: Args = {
  ...settings,
  ...parse(Deno.args, {
    string: ['cfg', 'dir', 'editor', 'ext'],
    alias: {
      category: ['c', 'cat'],
      cfg: ['config'],
      dir: 'd',
      editor: 'e',
      extension: ['x', 'ext'],
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
