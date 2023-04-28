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

export async function parseJsonFile(filepath: string): Promise<Args> {
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
