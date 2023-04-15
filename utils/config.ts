import { parseJsonFile, addUserDir } from './lib.ts';

export async function getUserSettings(defaultFile: string) {
  const defaults = await parseJsonFile(defaultFile);
  const userSettings = await parseJsonFile(addUserDir(defaults.cfg));
  const config = { ...defaults, ...userSettings };
  config.cfg = addUserDir(config.cfg);
  config.dir = addUserDir(config.dir);
  return { ...defaults, ...config };
}
