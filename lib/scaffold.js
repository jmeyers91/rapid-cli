const path = require('path');
const snakeCase = require('lodash.snakeCase');
const { exists, writeFile, readFile } = require('then-fs');
const { exec } = require('child_process');

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
  await run(`git clone https://github.com/jmeyers91/rapid-template.git ${projectPath}`);
  
  console.log('Installing dependencies...');
  await run('npm install', {cwd: projectPath});
  
  console.log('Initializing git')
  await run('rm -rf .git', {cwd: projectPath});
  await run('git init', {cwd: projectPath});

  const defaultConfigPath = path.join(projectPath, 'config/config.default.js');
  const configOverrides = {
    DATABASE_NAME: snakeCase(projectName)
  };
  await replaceInFile(defaultConfigPath, templateRegex, (_, key) => configOverrides[key] || '');
  console.log('Done');
};

function run(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, error => {
      if(error) reject(error);
      else resolve();
    });
  });
}

async function replaceInFile(filePath, regex, replacement) {
  const content = await readFile(filePath, 'utf8');
  return writeFile(content.replace(regex, replacement), 'utf8');
}
