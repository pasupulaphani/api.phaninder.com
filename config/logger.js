var bunyan = require('bunyan');
var config = require('./config');
var logSettings = config.logSettings;

var Logger = bunyan.createLogger({
  name: config.app_name,
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

module.exports = Logger;
