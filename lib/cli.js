#!/usr/bin/env node

const { argv } = require('yargs');
const path = require('path');

const rootDir = argv.root ? path.resolve(argv.root) : process.cwd();
const commands = argv._.reduce((commands, key) => {
  commands[key] = true;
  return commands;
}, {});
const handleError = error => console.log(error);

async function main() {
  if(commands.version || argv.version || argv.v) {
    console.log(require('../package').version);
  } else if(commands.init) {
    return require('./scaffold')(rootDir, argv._[1]).catch(handleError);
  } else if(commands.watch || argv.watch) {
    return require('./watch')(rootDir);
  } else {
    return require('./start')(rootDir, commands).catch(handleError);
  }
}

main().catch(error => console.log(error));
