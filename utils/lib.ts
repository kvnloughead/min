import { ALIASES } from './constants.ts';

import { path, yamlStringify } from '../deps.ts';

export async function writeMetadataToFile(
  filepath: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  Object.keys(metadata).forEach(
    (key) => metadata[key] === undefined && delete metadata[key],
  );
  await Deno.writeTextFile(filepath, `---\n${yamlStringify(metadata)}---`);
}

export async function parseJsonFile(filepath: string): Promise<Options> {
  const data = await Deno.readFile(filepath);
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(data);
  return JSON.parse(text);
}

export function addUserDir(filepath: string) {
  const home = Deno.env.get('HOME') || '';
  return filepath.startsWith(home) ? filepath : path.join(home, filepath);
}

/**
 * Returns an array of string with rows for a table.
 *
 * @param {string[][]} data - An array of arrays of strings representing the data to be logged.
 * @returns {string[]} - An array of strings containing the parsed rows. Join then to log a table to the console.
 */
export function generateRows(
  data: string[][],
  indent = 0,
  minWidths: number[] = [],
): string[] {
  // Determine the maximum length of each column
  const lengths = data[0].map((_, index) => {
    const column = data.map((row) => row[index]);
    return Math.max(...column.map((cell) => cell?.length));
  });

  // Create the table rows
  const rows = data.map((row, i) => {
    const cells = row.map((cell, index) =>
      cell.padEnd(Math.max(lengths[index], minWidths[index] || 0)),
    );
    return ' '.repeat(indent) + cells.join(' ');
  });

  return rows;
}

/**
 * Returns a string containing a table of data.
 *
 * @param {string[][]} data - An array of arrays of strings representing the data to be logged.
 * @returns {string} - a string, formatted as a table
 */
export function generateTable(
  data: string[][],
  indent = 0,
  minWidths: number[] = [],
): string {
  return generateRows(data, indent, minWidths).join('\n');
}

/**
 * Parses a cli command, returning original command, or the appropriate alias.
 *
 * @param {string} command - a cli command or alias
 * @returns {{string|undefined}} - the command corresponding to the alias, or else the original command param
 */
export function parseCommand(command: string): string | undefined {
  const commands = Object.keys(ALIASES.commands);
  if (commands.includes(command)) return command;
  return commands.find((key) => ALIASES.commands[key] === command) || command;
}

/**
 *
 * Confirms an action with the user if force is falsey.
 *
 * @param {boolean} force - If true, the action will be confirmed without prompting the user.
 * @param {string} msg - The message to display to the user in the confirmation prompt.
 * @returns {boolean} - Returns true if the user confirms the action or if force is truthy, otherwise false.
 */
export function confirmAction(force: boolean, msg: string) {
  let confirm;
  if (!force) {
    confirm = prompt(msg);
  }
  return force || (confirm && ['y', 'yes'].includes(confirm.toLowerCase()));
}

export function logError(err: Error) {
  console.log(`\n`);
  console.error(err);
  console.log(`\n`);
}

export function log(message?: unknown, ...optionalParams: unknown[]) {
  console.log('\n' + message, ...optionalParams, '\n');
}

export async function parsePath(options: Options, args: string[]) {
  try {
    const dirpath = path.join(options.dir, options.category);
    const basename = `${args[0]}.${options.extension}`;
    const filepath = path.join(dirpath, basename);
    const file = await Deno.open(filepath);
    file.close();
    options.path = { dirpath, basename, filepath, file };
  } catch (err) {
    options.error = err;
  }
}
