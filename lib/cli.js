#!/usr/bin/env node

const path = require('path');
const loadLocalRapid = require('./utils/loadLocalRapid');
const { argv } = require('yargs')
  .command('init', 'scaffold a rapid app')
  .command('start', 'start the rapid app in the root directory')
  .command('watch', 'start and watch the rapid app in the root directory')
  .command(
    'versions',
    'Print the CLI version and the rapid version in the root directory',
  )
  .option('root', {
    alias: 'r',
  });

const rootDir = argv.root ? path.resolve(argv.root) : process.cwd();
const commands = argv._.reduce((commands, key) => {
  commands[key] = true;
  return commands;
}, {});
const handleError = error => console.log(error);

async function main() {
  if (commands.versions || argv.versions) {
    const rapidPackage = loadLocalRapid.loadPackage(rootDir);
    const cliPackage = require('../package');
    console.log(
      `@simplej/rapid-cli ${cliPackage.version}\n` +
        `@simplej/rapid ${rapidPackage ? rapidPackage.version : 'not found'}`,
    );
  } else if (commands.init) {
    return require('./scaffold')(rootDir, argv._[1], argv).catch(handleError);
  } else if (commands.watch || argv.watch) {
    return require('./watch')(rootDir);
  } else {
    return require('./start')(rootDir, commands).catch(handleError);
  }
}

main().catch(error => console.log(error));
