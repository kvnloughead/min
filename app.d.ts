interface Args {
  [x: string]: unknown;
  category: string;
  extension: string;
  dir: string;
  editor: string;
  cfg: string;
  force: boolean;
  path: {
    dirpath: string;
    basename: string;
    filepath: string;
    file: Deno.FsFile;
  };
  error?: Error;
  _: string[];
}
