// Used to load @simplej/rapid from the app root directory (null if not found)
module.exports = rootDir =>
  require('import-from').silent(rootDir, '@simplej/rapid');
module.exports.loadPackage = rootDir =>
  require('import-from').silent(rootDir, '@simplej/rapid/package');
