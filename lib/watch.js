const nodemon = require('nodemon');
const path = require('path');

module.exports = async function watch(rootDir) {
  nodemon({
    exec: path.join(__dirname, 'cli.js'),
    ext: 'js json',
    watch: [rootDir],
    stdout: true,
    args: process.argv.slice(2).filter(s => s !== '--watch' && s !== 'watch'),
    delay: 2000
  });

  nodemon
    .on('start', () => {
      console.log('Watching for changes');
    })
    .on('quit', () => {
      console.log('Stopped');
      process.exit();
    })
    .on('restart', () => {
      console.log(`Restarting...\n`);
    });
};
