#!/usr/bin/env node

const { argv } = require('yargs');
const path = require('path');
const loadLocalRapid = require('./loadLocalRapid');

const rootDir = argv.root ? path.resolve(argv.root) : process.cwd();
const commands = argv._.reduce((commands, key) => {
  commands[key] = true;
  return commands;
}, {});
const handleError = error => console.log(error);

async function main() {
  if (commands.version || argv.version || argv.v) {
    const rapidPackage = loadLocalRapid.loadPackage(rootDir);
    const cliPackage = require('../package');
    console.log(
      `@simplej/rapid-cli ${cliPackage.version}\n` +
      `@simplej/rapid ${rapidPackage ? rapidPackage.version : 'not found'}`
    );
  } else if (commands.init) {
    return require('./scaffold')(rootDir, argv._[1]).catch(handleError);
  } else if (commands.watch || argv.watch) {
    return require('./watch')(rootDir);
  } else {
    return require('./start')(rootDir, commands).catch(handleError);
  }
}

main().catch(error => console.log(error));
