const { readFile, writeFile } = require('then-fs');

module.exports = async function replaceInFile(filePath, regex, replacement) {
  const content = await readFile(filePath, 'utf8');
  return writeFile(filepath, content.replace(regex, replacement), 'utf8');
};
