# min

A minimal note taking app. It's basically just a set of aliases for basic file
operations. It lets you create, read, update, and delete notes. Editing is done
in your text editor of choice.

## Setup

Setup is simple.

```
git clone https://github.com/kvnloughead/min.git
cd min
deno task install
```

## Usage

Basic usage is straightforward. For example, to open a note in your editor, you
would use the `edit` command.

```
min edit my-note.md
```

This will open the file `my-note.md` in your editor, creating it if it doesn't
exist. The full lists of commands and options are below.

For those who are unfamiliar with the notation, the commands are on the left and
the next column indicates the parameters. If a parameter is in angle brackets, it
is required. If it is in square brackets, it is optional.

Default values are shown in the rightmost column. These can be overridden via a
configuration file, or via flags on the command line. See [CONFIGURATION](#configuration) for more details.

```
  Commands:

    edit, e         <filename>            - Opens min page for editing.
    cat, c          <filename>            - Prints contents of min page to stdout.
    rename, mv, rn  <filename> <newname>  - Renames min page.
    remove, rm, r   <filename>            - Deletes min page.
    ls, l, list     [pattern]             - Lists min pages, with optional pattern matching.
    g, grep         <pattern>             - Greps through min pages, using `grep -inr --color=auto` by default.
    o, open                               - Opens min directory in your chosen edit.
    completions                           - Generate shell completions.

Options:

    -h, --help                      - Show this help.
    -V, --version                   - Show the version number for this program.
    --dev                           - Run in development mode.
    -c, --category      <category>  - Category to place min page in.             (Default: "notes")
    --cfg, --config     <file>      - Configuration file to use.                 (Default: "/Users/kevinloughead/.config/min/settings.json")
    -d, --dir           <dir>       - Directory to store min pages in.           (Default: "/Users/kevinloughead/.config/min")
    -e, --editor        <editor>    - Editor to open min pages with.             (Default: "vim")
    --ext, --extension  <ext>       - Extension of file to create.               (Default: "md")
    -f, --force                     - Take action without confirmation.
    -v, --verbose                   - Provides verbose logging.
```

## Configuration

Configuration is done via a JSON file. The default location is `~/.config/min/settings.json`.
Here's an example of what the file might look like.

```json
{
  "extension": "md",
  "editor": "code",
  "dir": "Dropbox/min/"
}
```

In this example, the `editor` field is set to `code`, the `dir` field (i.e., the directory where notes will be stored) is set to `Dropbox/min/`.
