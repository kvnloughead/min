export const help = {
  app: () =>
    console.log(
      `\nUsage: min <command>
          
        DESCRIPTION
        
        \tA minimal, DIY, man page supplement.
        \tRun \`min <command> -h for command specific help.\`

        COMMANDS

        \tedit\tOpens min page for editing. \n\t\tCreates new page if nonexisteent.
        \tview\tOutput content of min page to terminal.
        \topen\tOpens directory of min pages.
        
        `.replace(/^ {2,}/gm, ''),
    ),
  edit: () =>
    console.error('\nUsage: min edit <page>\nPlease specify a page to edit.\n'),
  view: () =>
    console.error('\nUsage: min view <page>\nPlease specify a page view.\n'),
  open: () =>
    console.error(
      '\nUsage: min open\nOpens min directory in the your chosen editor.\n',
    ),
};
