
module.exports = async function start(rootDir, commands) {
  const loadLocalRapid = require('./loadLocalRapid');
  const Rapid = loadLocalRapid(rootDir);
  if(!Rapid) {
    console.log(
      `Invalid rapid project: "${rootDir}"\n@simplej/rapid must be requirable from the app root to start using the CLI`
    );
    process.exit(1);
  }
  const rapid = new Rapid(rootDir);

  let shouldStop = false;

  if (commands.clear) {
    rapid.clear();
    shouldStop = true;
  }
  if (commands.migrate) {
    rapid.migrate();
    shouldStop = true;
  }
  if (commands.seed) {
    rapid.seed();
    shouldStop = true;
  }
  if (commands.rollback) {
    rapid.rollback();
    shouldStop = true;
  }

  rapid.autoload();
  await rapid.start();

  if (!commands.start && shouldStop) {
    await rapid.stop();
    rapid.log('Done');
    process.exit();
  } else {
    rapid.log('Started');
  }
};
