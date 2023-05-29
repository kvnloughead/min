// @deno-types="../app.d.ts"

import { confirmAction, logError } from '../utils/lib.ts';

async function remove(options: Options) {
  const { path } = options;

  try {
    if (options.error) {
      throw options.error;
    }

    const confirmRemove = confirmAction(
      options.force,
      `\nDelete: ${path.categoryAndBasename}? (yes|no): `,
    );
    if (confirmRemove) {
      await Deno.remove(path.filepath);
    }
  } catch (err) {
    if (options.verbose || err.name !== 'NotFound') {
      logError(err);
    }
    if (err.name === 'NotFound') {
      console.error(`\nFile doesn't exist: ${path.categoryAndBasename}\n`);
    }
  }
}

export default remove;
