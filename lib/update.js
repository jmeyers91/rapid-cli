const { version } = require('../package');
const path = require('path');
const download = require('download');
const run = require('./utils/run');
const cwd = process.cwd();

module.exports = async (force) => {
  console.log(`Updating Rapid-CLI`, isLocal());
  const remoteVersion = await getRemoveVersion();
  if(force || remoteVersion !== version) {
    await run('npm', ['install', '--global', 'https://github.com/jmeyers91/rapid-cli']);
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

async function isLocal() {
  const a = process.argv[1];
  const b = path.relative(cwd, a);
  const c = b.replace(/^(\.\.\/)*/g, '');
  const d = c.startsWith('node_modules/.bin/');
  console.log({a,b,c,d});
  return d;
}
