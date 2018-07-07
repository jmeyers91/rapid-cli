const path = require('path');
const snakeCase = require('lodash.snakeCase');
const { exists } = require('then-fs');
const execa = require('execa');
const replaceInFile = require('./utils/replaceInFile');

const templateRegex = /\{\{\s*(\S+)\s*\}\}/g; // ex: {{ value }}

module.exports = async function scaffold(rootDir, projectName) {
  if(!projectName) {
    console.log('Usage: rapid init projectName');
    process.exit(1);
  }
  const projectPath = path.resolve(projectName);
  if(await exists(projectPath)) {
    console.log(`The file "${projectPath}" already exists`);
    process.exit(1);
  }

  console.log(`Creating Rapid app "${projectName}"`);
  console.log('Cloning...');
  await execa('git', ['clone', 'https://github.com/jmeyers91/rapid-template.git', projectPath]);
  await execa('rm', ['publish'], {cwd: projectPath});
  
  console.log('Installing dependencies...');
  await execa('npm', ['install'], {cwd: projectPath});  

  console.log('Initializing git')
  await execa('rm', ['-rf', '.git'], {cwd: projectPath});
  await execa('git', ['init'], {cwd: projectPath});

  const defaultConfigPath = path.join(projectPath, 'config/config.default.js');
  const configOverrides = {
    DATABASE_NAME: snakeCase(projectName)
  };
  await replaceInFile(defaultConfigPath, templateRegex, (_, key) => configOverrides[key] || '');
  console.log('Done');
};
