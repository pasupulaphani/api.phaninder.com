var bunyan      = require('bunyan');

var config      = require('../config');
var logSettings = config.logSettings;

var log = bunyan.createLogger({
  name: config.site.name,
  src: true,
  streams : [
    {
      stream  : process.stdout,
      level : logSettings.stdoutLevel
    },
    {
      path : logSettings.logFile,
      level : logSettings.logFileLevel
    }
  ],
  serializers: bunyan.stdSerializers
});

module.exports = log;
