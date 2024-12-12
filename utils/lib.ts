import { path } from "../deps.ts";
import { ParsedPath } from "https://deno.land/std@0.183.0/path/_interface.ts";

export async function parseJsonFile(filepath: string): Promise<Options> {
  const data = await Deno.readFile(filepath);
  const decoder = new TextDecoder("utf-8");
  const text = decoder.decode(data);
  return JSON.parse(text);
}

export function addUserDir(filepath: string) {
  const home = Deno.env.get("HOME") || "";
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
  minWidths: number[] = []
): string[] {
  // Determine the maximum length of each column
  const lengths = data[0].map((_, index) => {
    const column = data.map((row) => row[index]);
    return Math.max(...column.map((cell) => cell?.length));
  });

  // Create the table rows
  const rows = data.map((row) => {
    const cells = row.map((cell, index) =>
      cell.padEnd(Math.max(lengths[index], minWidths[index] || 0))
    );
    return " ".repeat(indent) + cells.join(" ");
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
  minWidths: number[] = []
): string {
  return generateRows(data, indent, minWidths).join("\n");
}

/**
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
  return force || (confirm && ["y", "yes"].includes(confirm.toLowerCase()));
}

export function logError(err: Error) {
  console.log(`\n`);
  console.error(err);
  console.log(`\n`);
}

export function log(message?: unknown, ...optionalParams: unknown[]) {
  console.log("\n" + message, ...optionalParams, "\n");
}

export async function parsePath(options: Options, args: string[]) {
  try {
    const basename = args[0];
    const extension = options.extension ? `.${options.extension}` : "";
    const category = options.category || "notes";
    const dirpath = path.join(options.dir, category);
    const filepath = path.join(dirpath, `${basename}${extension}`);
    const categoryAndBasename = path.join(category, basename);

    options.path = {
      basename,
      dirpath,
      filepath,
      categoryAndBasename,
    };
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Convert the technical error into a user-friendly message
      options.error = new Error(
        `Unable to access path: ${options.dir}\nPlease check if the directory exists and you have proper permissions.`
      );
    } else {
      options.error = err instanceof Error ? err : new Error(String(err));
    }
  }
}

export async function getFiles(
  directory: string,
  pattern?: RegExp | string,
  options?: { recursive: boolean }
): Promise<ParsedPath[]> {
  let files: ParsedPath[] = [];
  const regex =
    pattern instanceof RegExp ? pattern : pattern && new RegExp(pattern);
  for await (const dirEntry of Deno.readDir(directory)) {
    if (dirEntry.isDirectory && options?.recursive) {
      files = [
        ...files,
        ...(await getFiles(
          path.join(directory, dirEntry.name),
          pattern,
          options
        )),
      ];
    }
    if (dirEntry.isFile && (!regex || regex.test(dirEntry.name))) {
      files.push(path.parse(path.join(directory, dirEntry.name)));
    }
  }
  return files;
}
