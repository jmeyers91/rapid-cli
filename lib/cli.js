#!/usr/bin/env node

const { argv } = require('yargs');

const rootDir = argv.root ? path.resolve(argv.root) : process.cwd();
const commands = argv._.reduce((commands, key) => {
  commands[key] = true;
  return commands;
}, {});

const handleError = error => console.log(error);
if(commands.init) {
  require('./scaffold')(rootDir, argv._[1]).catch(handleError);
} else if(argv.watch) {
  require('./watch')(rootDir);
} else {
  require('./start')(rootDir, commands).catch(handleError);
}
