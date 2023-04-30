#!/usr/bin/env deno run --allow-env --allow-read
// @deno-types="./app.d.ts"

import { parse } from './deps.ts';
import edit from './commands/edit.ts';
import view from './commands/view.ts';
import open from './commands/open.ts';

import { helpWriter } from './utils/HelpWriter.ts';
import { getUserSettings } from './config/index.ts';
import { DEFAULT_CONFIG } from './utils/constants.ts';
import { parseCommand } from './utils/lib.ts';

let args: Args = parse(Deno.args, {
  boolean: ['dev', 'help'],
  string: ['cfg', 'dir', 'editor', 'ext', '_'],
  alias: {
    category: ['c', 'cat'],
    cfg: ['config'],
    dir: 'd',
    editor: 'e',
    extension: ['x', 'ext'],
    help: ['h'],
  },
});

const settings = await getUserSettings(DEFAULT_CONFIG, args);
args = { ...args, ...settings };

if (args._.length === 0 || ['-h', '--help', 'help'].includes(String(args._))) {
  helpWriter.write();
  Deno.exit(0);
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
  case 'view':
    if (!args._[1] || args.help) {
      helpWriter.write('view');
    } else {
      view(args);
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
