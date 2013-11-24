var bunyan = require('bunyan');
var config = require('./config');
var logSettings = config.logSettings;

var log = bunyan.createLogger({
  name: 'helloapi',
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

function Logger(options) {
};

Logger.prototype.info  = function info(e) { log.info(e) };
Logger.prototype.debug = function debug(e) { log.debug(e) };
Logger.prototype.trace = function trace(e) { log.trace(e) };
Logger.prototype.error = function error(e) { log.error(e) };
Logger.prototype.warn  = function warn(e) { log.warn(e) };

module.exports = new Logger;
