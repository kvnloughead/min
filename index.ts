#!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { parse } from 'std/flags/mod.ts';

import edit from './commands/edit.ts';
import view from './commands/view.ts';

import { help } from './utils/help.ts';

const args: Args = parse(Deno.args, {
  default: {
    cfg: `/home/kevin/.config/min/settings.json`,
    dir: `/home/kevin/Dropbox/min/`,
    extension: `md`,
    editor: `code`,
  },
  string: ['cfg', 'dir', 'editor', 'ext'],
  alias: {
    editor: 'e',
    extension: ['x', 'ext'],
    dir: 'd',
    cfg: ['c', 'config'],
  },
});

if (args._.length === 0 || ['-h', '--help', 'help'].includes(String(args._))) {
  help.app();
  Deno.exit(0);
}

const command = args._[0];
switch (command) {
  case 'edit':
    if (!args._[1]) {
      console.error(
        `\nPlease specify a page to edit. \nUsage: min edit <page>\n`,
      );
    } else {
      edit(args);
    }
    break;
  case 'view':
    if (!args._[1]) {
      console.error(
        `\nPlease specify a page to view. \nUsage: min edit <page>\n`,
      );
    } else {
      view(args);
    }
    break;
  default:
    console.log(`Unknown command: ${command}`);
    Deno.exit(1);
}
