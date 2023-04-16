import { parseJsonFile, addUserDir } from '../utils/lib.ts';
import { DEV_CONFIG } from '../utils/constants.ts';

export async function getUserSettings(defaultFile: string, args: Args) {
  const defaults = await parseJsonFile(defaultFile);
  const cfgFile = args.dev ? DEV_CONFIG : args.cfg || defaults.cfg;
  const userSettings = await parseJsonFile(addUserDir(cfgFile || defaults.cfg));
  const config = { ...defaults, ...userSettings };
  config.cfg = addUserDir(args.cfg || config.cfg);
  config.dir = addUserDir(config.dir);
  return { ...defaults, ...config };
}
