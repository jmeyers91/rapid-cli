const path = require('path');
const snakeCase = require('lodash.snakeCase');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { exec } = require('child_process');

module.exports = async function scaffold(rootDir, projectName) {
  const run = (command, options={}) => new Promise((resolve, reject) => {
    exec(command, options, error => {
      if(error) reject(error);
      else resolve();
    });
  });

  if(!projectName) {
    console.log('Usage: rapid init projectName');
    process.exit(1);
  }
  const projectPath = path.resolve(projectName);
  if(existsSync(projectPath)) {
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
  const defaultConfig = require(defaultConfigPath);
  const configOverrides = {
    DATABASE_NAME: snakeCase(projectName)
  };
  defaultConfig.database.connection.database = snakeCase(projectName);
  writeFileSync(defaultConfigPath, 
    readFileSync(defaultConfigPath, 'utf8').replace(/\{\{\s*(\S+)\s*\}\}/g, (_, key) => configOverrides[key] || '')
  );
  console.log('Done');
};
