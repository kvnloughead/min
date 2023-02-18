export const help = {
  app: () =>
    console.log(
      `\nUsage: min <command>
          
        DESCRIPTION
        
        \tA minimal, DIY, man page supplement.

        EXAMPLES

        \tmin edit <page> \t # opens min page for editing
        
        `.replace(/^ {2,}/gm, "")
    ),
  edit: "\nUsage: min edit <page>\nOpens min page for editing\n",
};
