module.exports = async function start(rootDir, commands) {
  const loadLocalRapid = require('./utils/loadLocalRapid');
  const Rapid = loadLocalRapid(rootDir);
  if (!Rapid) {
    console.log(
      `Invalid rapid project: "${rootDir}"\n@simplej/rapid must be requirable from the app root to start using the CLI`,
    );
    process.exit(1);
  }

  const rapid = new Rapid(rootDir).autoload();
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

  if (shouldStop && rapid.disableWebserver) {
    rapid.disableWebserver();
  }

  await rapid.start();

  if (shouldStop) {
    await rapid.stop();
    rapid.log('Done');
    process.exit();
  } else {
    rapid.log('Started');
  }
};
