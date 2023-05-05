// @deno-types="../app.d.ts"

import { confirmAction, logError } from '../utils/lib.ts';

async function remove(options: Options) {
  try {
    if (options.error) {
      throw options.error;
    }
    const { filepath } = options.path;
    const confirmRemove = confirmAction(
      options.force,
      `\nDelete: ${options.path.basename}? (yes|no): `,
    );
    if (confirmRemove) {
      await Deno.remove(filepath);
    }
  } catch (err) {
    if (options.verbose || err.name !== 'NotFound') {
      logError(err);
    }
    if (err.name === 'NotFound') {
      console.error(`\nFile doesn't exist: ${options.path.basename}\n`);
    }
  }
}

export default remove;
