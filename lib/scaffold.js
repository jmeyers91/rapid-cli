const path = require('path');
const snakeCase = require('lodash.snakeCase');
const { exists, readFile, writeFile } = require('then-fs');
const execa = require('execa');

const templateRegex = /\{\{\s*(\S+)\s*\}\}/g; // ex: {{ value }}

function run() {
  const child = execa.apply(null, arguments);
  child.stdout.pipe(process.stdout);
  return child;
}

module.exports = async function scaffold(rootDir, appName) {
  if (!appName) {
    console.log('Usage: rapid init appName');
    process.exit(1);
  }
  const appPath = path.resolve(appName);
  const inApp = { cwd: appPath };
  if (await exists(appPath)) {
    console.log(`The file "${appPath}" already exists`);
    process.exit(1);
  }

  console.log(`Creating Rapid app "${appName}"`);
  console.log('Cloning...');
  await run('git', [
    'clone',
    'https://github.com/jmeyers91/rapid-template.git',
    appPath,
  ]);
  await run('rm', ['publish'], inApp);

  console.log('Installing dependencies...');
  await run('npm', ['install'], inApp);

  console.log('Initializing git');
  await run('rm', ['-rf', '.git'], inApp);
  await run('git', ['init'], inApp);

  const configTemplatePath = path.join(appPath, 'config/configTemplate.hbs');
  const configPath = path.join(appPath, 'config/development.config.js');
  const configOverrides = {
    databaseName: snakeCase(appName),
  };

  const configTemplate = await readFile(configTemplatePath, 'utf8');
  const configContent = configTemplate.replace(
    templateRegex,
    (_, key) => configOverrides[key] || '',
  );
  await writeFile(configPath, configContent);
  await run('rm', ['config/configTemplate.hbs'], inApp);

  const herokuAppPath = path.join(appPath, 'app.json');
  const herokuApp = require(herokuAppPath);
  writeFile(herokuAppPath, JSON.stringify({
    name: appName,
    ...herokuApp,
  }, null, 2));

  console.log('Done');
};
