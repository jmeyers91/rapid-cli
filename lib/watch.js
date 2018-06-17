const nodemon = require('nodemon');

module.exports = async function watch(rootDir) {

  nodemon({
    exec: path.join(__dirname, 'cli.js'),
    ext: 'js json',
    watch: [rootDir],
    stdout: true,
    args: process.argv.slice(2).filter(s => s !== '--watch'),
    delay: 2000
  });
  
  nodemon.on('start', () => {
    console.log('App has started');
  }).on('quit', () => {
    console.log('App has quit');
    process.exit();
  }).on('restart', files => {
    console.log(`Restarting...\n`);
  });
};
