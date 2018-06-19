const Rapid = require('@simplej/rapid');

module.exports = async function start(rootDir, commands) {
  const rapid = new Rapid(rootDir)

  let shouldStop = false;

  if(commands.clear) {
    rapid.clear();
    shouldStop = true;
  }
  if(commands.migrate) {
    rapid.migrate();
    shouldStop = true;
  }
  if(commands.seed) {
    rapid.seed();
    shouldStop = true;
  }
  if(commands.rollback) {
    rapid.rollback();
    shouldStop = true;
  }

  rapid.discover
    .configs(
      'config/config.default.js',
      'config/config.js',
    )
    .Models('models/**/*.model.js')
    .Controllers('controllers/**/*.controller.js')
    .Routers('routers/**/*.router.js');

  await rapid.start();

  if(!commands.start && shouldStop) {
    await rapid.stop();
    rapid.log('Done');
    process.exit();
  } else {
    rapid.log('Started');
  }
};
