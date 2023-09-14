interface Options {
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
    categoryAndBasename?: string;
  };
  newName?: string;
  error?: Error;
  _: string[];
}
