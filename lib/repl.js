
module.exports = function startRepl(rapid) {
  require('repl').start({
    prompt: '',
    async eval(command, context, filename, callback) {
      try {
        const result = await eval(`
          (async () => {
            const { models, actions, database, webserver, controllers, config } = rapid;
            const { ${Object.keys(rapid.models).join(', ')} } = models;
            const { ${Object.keys(rapid.actions).join(', ')} } = actions;

            return ${command};
          })();
        `);
        callback(null, result);
      } catch(error) {
        callback(error);
      }
    }
  });
};
