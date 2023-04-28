import { generateRows, generateTable } from './lib.ts';

type Command = 'app' | 'edit' | 'view' | 'open';

type CommandDescriptions = Record<
  Command,
  {
    usage: string;
    description: string;
  }
>;

type Option = {
  name: string;
  alias?: string;
  description: string;
  default?: string;
};

type HelpOptions = {
  commands: CommandDescriptions;
  options: Option[];
};
export class HelpWriter {
  private options: HelpOptions;
  private alignedNames: string[];
  private columnWidths: [number, number];

  constructor(options: HelpOptions) {
    this.options = options;
    this.alignedNames = this.generateOptionsRows();
    this.options.options.forEach(
      (flag, i) => (flag.name = this.alignedNames[i]),
    );
    this.columnWidths = this.calculateColumnWidths();
  }

  write(command?: Command) {
    if (!command) {
      this.writeAll();
      return;
    }

    if (!(command in this.options.commands)) {
      console.error(`Unknown command: ${command}`);
      this.writeAll();
      return;
    }

    const { usage, description } = this.options.commands[command];
    console.log(`\nUsage: min ${usage}\n\n${description}\n`);
  }

  private writeAll() {
    console.log(
      `\nUsage: min <command>\n\nDESCRIPTION\n\n  A minimal, DIY, man page supplement.\n  Run \`min <command> -h\` for command specific help.\n`,
    );
    console.log(this.generateCommandsTable());
    console.log(this.generateOptionsTable());
    this.generateOptionsRows();
  }

  private calculateColumnWidths(): [number, number] {
    const commandEntries = Object.entries(this.options.commands);
    const commandRows = commandEntries.map(([command, { description }]) => [
      `min ${command}`,
      description,
    ]);

    const optionRows = this.options.options.map(
      ({ name, alias, description }) => [`${alias ?? ''} ${name}`, description],
    );

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
    const commandEntries = Object.entries(this.options.commands);
    const commandRows = commandEntries.map(([command, { description }]) => [
      `min ${command}`.padEnd(this.columnWidths[0]),
      description,
    ]);

    return `\nCOMMANDS\n\n${generateTable(
      commandRows,
      2,
      this.columnWidths,
    )}\n`;
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
      ({ name, alias, description }) => [
        `${alias ?? ''} ${name}`.padEnd(this.columnWidths[0]),
        description,
      ],
    );

    return `\nOPTIONS\n\n${generateTable(optionRows, 2, [0, 0, 10, 0])}\n`;
  }
}

const helpOptions: HelpOptions = {
  commands: {
    app: {
      usage: '',
      description: 'A description of the "app" command',
    },
    edit: {
      usage: 'edit [file]',
      description:
        'Opens a min page for editing. Creates a new page if none exists.',
    },
    view: {
      usage: 'view',
      description: 'Output content of min page to the terminal',
    },
    open: {
      usage: 'open',
      description: 'Opens directory of min pages',
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
      name: '--cfg --config',
      description: 'Path to config file.',
    },
    {
      name: '-d --dir',
      description: 'Path to notes directory.',
    },
    {
      name: '-c --cat',
      description: 'Category that the note should be placed in.',
    },
    {
      name: '-e --editor',
      description: 'The editor to open the note with.',
      // default: 'vim',
    },
  ],
};

export const helpWriter = new HelpWriter(helpOptions);
