import { generateRows, generateTable } from './lib.ts';

type Command = 'app' | 'edit' | 'view' | 'open' | 'remove' | 'list';

type CommandDescriptions = Record<
  Command,
  {
    usage: string;
    brief?: string;
    description: string;
    examples?: string[][];
  }
>;

type Option = {
  name: string;
  alias?: string;
  description: string;
  default?: string;
};

type HelpOptions = {
  name: string;
  commands: CommandDescriptions;
  options: Option[];
};
export class HelpWriter {
  private options: HelpOptions;
  private name: string;
  private alignedNames: string[];
  private columnWidths: [number, number];

  constructor(options: HelpOptions) {
    this.options = options;
    this.name = options.name;
    this.alignedNames = this.generateOptionsRows();
    this.options.options.forEach(
      (flag, i) => (flag.name = this.alignedNames[i]),
    );
    this.columnWidths = [0, 0];
  }

  write(command: Command = 'app') {
    this.columnWidths = this.calculateColumnWidths(command);

    if (!(command in this.options.commands)) {
      console.error(`Unknown command: ${command}`);
      this.write('app');
      return;
    }

    console.log(this.generatePreamble(command));
    command === 'app' && console.log(this.generateCommandsTable());
    if (this.options.commands[command].examples !== undefined) {
      console.log(this.generateExamplesTable(command));
    }
    console.log(this.generateOptionsTable());
  }

  private generatePreamble(command: Command) {
    const { usage, description } = this.options.commands[command];
    return `\nUsage: ${
      command !== 'app' ? this.name + ' ' : ''
    }${usage}\n\nDESCRIPTION\n\n ${description}\n`;
  }

  private calculateColumnWidths(command: Command): [number, number] {
    // generate command rows
    const commandEntries = Object.entries(this.options.commands);
    const commandRows = commandEntries.map(
      ([command, { description, brief }]) => [
        `min ${command}`,
        brief || description,
      ],
    );

    // generate options rows
    let optionRows = this.options.options.map(
      ({ name, alias, description }) => [`${alias ?? ''} ${name}`, description],
    );

    // if there are examples, generate those
    if (this.options.commands[command].examples !== undefined) {
      optionRows = optionRows.concat(
        this.options.commands[command].examples as string[][],
      );
    }

    // determine column widths
    const columnWidths = commandRows.concat(optionRows).reduce(
      ([maxWidths1, maxWidths2], [column1, column2]) => [
        [
          Math.max(maxWidths1[0], column1.length),
          Math.max(maxWidths1[1], column2.length),
        ],
        [
          Math.max(maxWidths2[0], column1.length),
          Math.max(maxWidths2[1], column2.length),
        ],
      ],
      [
        [0, 0],
        [0, 0],
      ],
    );

    return [
      Math.max(columnWidths[0][0], columnWidths[1][0]) + 6,
      Math.max(columnWidths[0][1], columnWidths[1][1]),
    ];
  }

  private generateCommandsTable() {
    const commandEntries = Object.entries(this.options.commands).filter(
      (command) => command[0] !== 'app',
    );
    const commandRows = commandEntries.map(
      ([_, { usage, brief, description }]) => [
        `min ${usage}`.padEnd(this.columnWidths[0]),
        brief || description,
      ],
    );
    return `\nCOMMANDS\n\n${generateTable(commandRows, 2, this.columnWidths)}`;
  }

  private generateOptionsRows() {
    // parse the lists of flags
    const names = this.options.options.map(({ name }) => name.split(' '));

    names.forEach((aliases) => {
      if (aliases[0].startsWith('--')) {
        aliases.unshift(' '.repeat(4));
      }
    });

    return generateRows(names);
  }

  private generateOptionsTable() {
    const optionRows = this.options.options.map(
      ({ name, alias, description, default: defaultValue }) => [
        `${alias ?? ''} ${name}`.padEnd(this.columnWidths[0]),
        description + (defaultValue ? ` [default: ${defaultValue}]` : ''),
      ],
    );

    return `\nOPTIONS\n\n${generateTable(optionRows, 2, [0, 0, 10, 0])}\n`;
  }

  private generateExamplesTable(command: Command) {
    const examples = this.options.commands[command].examples as string[][];
    const exampleRows = examples.map(([ex, desc]) => [
      ex.padEnd(this.columnWidths[0]),
      desc,
    ]);

    return `\nEXAMPLES\n\n${generateTable(exampleRows, 2, [0, 0, 10, 0])}\n`;
  }
}

const helpOptions: HelpOptions = {
  name: 'min',
  commands: {
    app: {
      usage: 'min <command>',
      description: `A minimal, DIY, man page supplement.\n Run \`min <command> -h\` for command specific help.`,
    },
    edit: {
      usage: 'edit <basename>',
      brief: 'Opens a min page for editing.',
      description:
        'Opens a min page for editing. Creates a new page if none exists.\n Files are opened in the location specified by --dir, and in the chosen --editor.\n Files are stored in subdirectories according to their category (--cat).',
      examples: [
        ['min edit curl', 'Opens a file curl.md in default --dir for editing'],
        [
          'min edit --dir ~/sample-dir curl',
          'Opens a file ~/sample-dir/curl.md for editing',
        ],
        ['min edit -e code curl', 'Opens curl.md in default --dir with vscode'],
      ],
    },
    remove: {
      usage: 'remove <basename>',
      description: 'Deletes the specified min page.',
      examples: [
        ['min remove foo', 'Removes foo.md from default --dir if it exists.'],
      ],
    },
    view: {
      usage: 'view <basename>',
      description: 'Outputs min page to terminal.',
      examples: [
        ['min view curl', 'Opens a file curl.md in default --dir for editing'],
        [
          'min view --dir ~/sample-dir curl',
          'Opens a file ~/sample-dir/curl.md for editing',
        ],
        ['min view -e code curl', 'Opens curl.md in default --dir with vscode'],
      ],
    },
    open: {
      usage: 'open',
      description: 'Opens directory of min pages',
    },
    list: {
      usage: 'list [pattern]',
      description: 'Lists all notes that match a pattern.',
      examples: [
        ['min list', 'Lists all files in --dir'],
        [
          'min list pattern',
          'Lists all files containing "pattern" in the path',
        ],
      ],
    },
  },
  options: [
    {
      name: '-h --help',
      description: 'Show this help message',
    },
    {
      name: '--dev',
      description: 'Run in developer mode.',
    },
    {
      name: '--cfg',
      description: 'Path to config file.',
    },
    {
      name: '-d --dir',
      description: 'Path to notes directory.',
    },
    {
      name: '-c --cat',
      description: 'Category that the note should be placed in.',
      default: 'notes',
    },
    {
      name: '-e --editor',
      description: 'The editor to open the note with.',
      default: 'vim',
    },
    {
      name: '-f --force',
      description: 'Force command to run without confirmation.',
      default: 'false',
    },
    {
      name: '-v --verbose',
      description: 'Provide verbose logging and error reporting',
      default: 'false',
    },
  ],
};

export const helpWriter = new HelpWriter(helpOptions);
