const { spawn } = require('child_process');

module.exports = function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, Object.assign({
      stdio: 'inherit'
    }, options));
    child.once('exit', resolve);
    child.once('error', reject);
  });
};
