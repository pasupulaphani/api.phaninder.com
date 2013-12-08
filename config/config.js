var env = require('/etc/env.json');

function Config() {
  var node_env = process.env.NODE_ENV || 'dev';
  console.log("Loading app in :" + node_env + " mode");
  return env[node_env];
};

module.exports = new Config;