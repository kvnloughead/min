export const DEFAULT_CONFIG = `${
  Deno.env.get('HOME') || ''
}/.config/min/settings.json`;

export const DEFAULT_DIR = `${Deno.env.get('HOME') || ''}/.config/min`;

export const ALIASES: { commands: Record<string, string> } = {
  commands: { edit: 'e', cat: 'c', open: 'o', remove: 'rm', list: 'l' },
};
