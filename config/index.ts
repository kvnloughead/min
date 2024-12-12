import { addUserDir, parseJsonFile } from "../utils/lib.ts";
import { DEFAULT_DIR } from "../utils/constants.ts";

/**
 * Retrieves configuration settings from a file, and merges them with the
 * specified command line arguments.
 *
 * User's can specify their own config file at an arbitrary location via the
 * cfg field in the default config file, or via the --cfg command line flag.
 *
 * If the --dev flag is set, the development configuration will be
 * loaded from the devConfig field of the configuration file.
 *
 * Settings are loaded in the following sequence:
 *
 *  1. The default configuration at HOME/.config/min/settings.json is loaded
 *  2. If a secondary config is specified, those settings overwrite the
 *     corresponding settings from the default config
 *  3. If the --dev flag is setting, the specified devConfig are then loaded.
 *     These settings can be specified in the default config, or a config
 *     that's specified at run time
 *  4. Default values are then applied, as needed.
 *
 * @param {string} cfgFile - The path to the configuration file
 * @param {Options} args - The command line arguments. Should be parsed by Deno.parse
 * @returns {Promise<object>} An object containing the merged configuration settings
 */
export async function getConfig(
  cfgFile: string,
  args: Options,
): Promise<{
  [x: string]: unknown;
  category: string;
  extension: string;
  dir: string;
  editor: string;
  cfg: string;
  force: boolean;
  path: { dirpath: string; basename: string; filepath: string };
  error?: Error | undefined;
  _: string[];
}> {
  let config = await parseJsonFile(addUserDir(cfgFile));

  // if a config file is specified in the args, or in the default config file
  // parse the specified config file and add to configuration
  if (args.cfg || config.cfg) {
    const moreConfig = await parseJsonFile(addUserDir(args.cfg || config.cfg));
    config = { ...config, ...moreConfig };
  }

  // if args.dev and the config file contains devConfig settings
  // parse those settings and add to configuration
  if (args.dev && config.devConfig) {
    Object.entries(config.devConfig).forEach(([k, v]) => {
      config[k] = v;
    });
    config.cfg = cfgFile;
  }

  // add HOME dir to filepaths in case it isn't present already
  config.cfg = addUserDir(args.cfg || config.cfg || cfgFile);
  config.dir = addUserDir(args.dir || config.dir || DEFAULT_DIR);

  return { ...config, ...args };
}
