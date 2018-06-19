const { version } = require('../package');
const download = require('download');
const run = require('./utils/run');

module.exports = async (force) => {
  console.log(`Updating Rapid-CLI`);
  const remoteVersion = await getRemoveVersion();
  if(force || remoteVersion !== version) {
    await run('npm', ['install', '--global', 'https://github.com/jmeyers91/rapid-cli']);
  } else if(!force) {
    console.log(`Already up to date.`);
  }
};

function getRemoveVersion() {
  return downloadRemotePackage().then(p => p.version);
}

function downloadRemotePackage() {
  const remotePackageUrl = 'https://raw.githubusercontent.com/jmeyers91/rapid-cli/master/package.json';
  return download(remotePackageUrl).then(data => JSON.parse(data.toString()));
}
