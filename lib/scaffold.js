const path = require('path');
const snakeCase = require('lodash.snakeCase');
const { exists, readFile, writeFile } = require('then-fs');
const execa = require('execa');

const templateRegex = /\{\{\s*(\S+)\s*\}\}/g; // ex: {{ value }}

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
  await execa('git', [
    'clone',
    'https://github.com/jmeyers91/rapid-template.git',
    appPath
  ]);
  await execa('rm', ['publish'], inApp);

  console.log('Installing dependencies...');
  await execa('npm', ['install'], inApp);

  console.log('Initializing git');
  await execa('rm', ['-rf', '.git'], inApp);
  await execa('git', ['init'], inApp);

  const configTemplatePath = path.join(appPath, 'config/config.template.js');
  const configPath = path.join(appPath, 'config/config.default.js');
  const configOverrides = {
    databaseName: snakeCase(appName)
  };

  const configTemplate = await readFile(configTemplatePath, 'utf8');
  const configContent = configTemplate.replace(templateRegex, (_, key) => configOverrides[key] || '');
  await writeFile(configPath, configContent);
  await execa('rm', ['config/config.template.js'], inApp);
  console.log('Done');
};
