const Rapid = require('@simplej/rapid');

module.exports = async function start(rootDir, commands) {
  const rapid = new Rapid(rootDir)
    .addConfigs(
      'config/config.default.js',
      'config/config.js',
    )
    .addModels('models/**/*.model.js')
    .addControllers('controllers/**/*.controller.js')
    .addRouters('routers/**/*.router.js');

  await rapid.start();
  let shouldStop = false;

  if(commands.clear) {
    await rapid.database.clear();
    shouldStop = true;
  }
  if(commands.migrate) {
    await rapid.database.migrate();
    shouldStop = true;
  }
  if(commands.seed) {
    await rapid.database.seed();
    shouldStop = true;
  }

  if(!commands.start && shouldStop) {
    await rapid.stop();
    rapid.log('Done');
    process.exit();
  } else {
    rapid.log('Started');
  }
};
