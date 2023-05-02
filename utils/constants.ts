export const DEFAULT_CONFIG = `./config/defaults.json`;
export const DEV_CONFIG = `${Deno.cwd()}/config/dev/settings.json`;
export const DEV_DIR = `${Deno.cwd()}/config/dev/notes`;

export const ALIASES: { commands: Record<string, string> } = {
  commands: { edit: 'e', view: 'v', open: 'o', remove: 'rm', list: 'l' },
};
