export const DEFAULT_CONFIG = `${
  Deno.env.get('HOME') || ''
}/.config/min/settings.json`;

export const DEFAULT_DIR = `${Deno.env.get('HOME') || ''}/.config/min`;
