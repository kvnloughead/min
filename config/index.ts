import { parseJsonFile, addUserDir } from '../utils/lib.ts';
import { DEV_CONFIG } from '../utils/constants.ts';

/**
 * Retrieves the user's settings from a JSON configuration file and combines them with default settings.
 *
 * @async
 * @function getUserSettings
 * @param {string} defaultFile - The path to the default JSON configuration file.
 * @param {object} args - An object containing command-line arguments.
 * @param {boolean} args.dev - Indicates whether the application is running in development mode.
 * @param {string} args.cfg - The path to the user's JSON configuration file.
 * @returns {Promise<object>} A Promise that resolves with an object containing the combined settings.
 * @throws {Error} If there is an error reading or parsing the configuration files.
 */
export async function getUserSettings(
  defaultFile: string,
  args: Options,
): Promise<{
  [x: string]: unknown;
  dir: string;
  editor: string;
  cfg: string;
  _: string[];
}> {
  const defaults = await parseJsonFile(defaultFile);
  // if args.dev is true, then the user is running in development mode
  // otherwise, accept cfg file from cli args, or the default file
  const cfgFile = args.dev ? DEV_CONFIG : args.cfg || defaults.cfg;
  const userSettings = await parseJsonFile(addUserDir(cfgFile || defaults.cfg));
  const config = { ...defaults, ...userSettings };
  config.cfg = addUserDir(args.cfg || config.cfg);
  config.dir = addUserDir(config.dir);
  return { ...defaults, ...config };
}
