const path = require('path');
const snakeCase = require('lodash.snakeCase');
const startCase = require('lodash.startcase');
const { exists, readFile, writeFile } = require('then-fs');
const execa = require('execa');
const Listr = require('listr');

const templateRegex = /\{\{\s*(\S+)\s*\}\}/g; // ex: {{ value }}

function run() {
  const child = execa.apply(null, arguments);
  // child.stdout.pipe(process.stdout);
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

  const configTemplatePath = path.join(appPath, 'config/configTemplate.hbs');
  const configPath = path.join(appPath, 'config/development.config.js');
  const configOverrides = {
    databaseName: snakeCase(appName),
  };

  const tasks = new Listr([
    {title: 'Clone', task: () => 
      run('git', [
        'clone',
        'https://github.com/jmeyers91/rapid-template.git',
        appPath,
      ])
    },
    {title: 'Clean up', task: () =>
      run('rm', ['publish'], inApp)
    },
    {title: 'Install dependencies', task: () =>
      run('npm', ['install'], inApp)
    },
    {title: 'Setup git repository', task: async () => {
      await run('rm', ['-rf', '.git'], inApp);
      await run('git', ['init'], inApp);
    }},
    {title: 'Add config', task: async () => {
      const configTemplate = await readFile(configTemplatePath, 'utf8');
      const configContent = configTemplate.replace(
        templateRegex,
        (_, key) => configOverrides[key] || '',
      );
      await writeFile(configPath, configContent);
      await run('rm', ['config/configTemplate.hbs'], inApp);
      
      const herokuAppPath = path.join(appPath, 'app.json');
      const herokuApp = require(herokuAppPath);
      await writeFile(
        herokuAppPath,
        JSON.stringify(
          {
            name: startCase(appName),
            ...herokuApp,
          },
          null,
          2,
        ),
      );
    }}
  ]);

  return tasks.run();
};
