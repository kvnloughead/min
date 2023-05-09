import { parseJsonFile, addUserDir } from '../utils/lib.ts';

/**
 * Retrieves configuration settings from a file, and merges them with the specified command line arguments.
 *
 * @param {string} cfgFile - The path to the configuration file
 * @param {Options} args - The command line arguments. Should be parsed by Deno.parse
 * @returns {Promise<object>} An object containing the merged configuration settings
 */
export async function getConfig(cfgFile: string, args: Options) {
  const config = await parseJsonFile(
    addUserDir(cfgFile || Deno.env.get('HOME') + `/.config/min/settings.json`),
  );
  config.cfg = Deno.env.get('HOME') + `/.config/min/settings.json`;
  config.dir = Deno.env.get('HOME') + `/.config/min`;
  return { ...config, ...args };
}
