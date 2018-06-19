const { version } = require('../package');
const path = require('path');
const download = require('download');
const run = require('./utils/run');
const cwd = process.cwd();

module.exports = async (force) => {
  console.log(`Updating Rapid-CLI`);
  const remoteVersion = await getRemoveVersion();

  if(force || remoteVersion !== version) {
    const repo = 'https://github.com/jmeyers91/rapid-cli';

    await run('npm', isLocal()
      ? ['install', repo]
      : ['install', '--global', repo]
    );
  } else if(!force) {
    console.log('Already up to date.')
  }
};

function getRemoveVersion() {
  return downloadRemotePackage().then(p => p.version);
}

function downloadRemotePackage() {
  const remotePackageUrl = 'https://raw.githubusercontent.com/jmeyers91/rapid-cli/master/package.json';
  return download(remotePackageUrl).then(data => JSON.parse(data.toString()));
}

// Determine if the cli is being run globaly (false) or locally in node_modules (true)
function isLocal() {
  return path.relative(cwd, process.argv[1])
    .replace(/^(\.\.\/)*/g, '')
    .startsWith('node_modules/.bin/');
}
