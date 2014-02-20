var Logger = function () {}

var logEntries = function() {
  var log = require('./logentries');
  
  var getLastItem = function (arr) {
  	return arr[arr.length - 1]
  };

  var LogEntry = function () {};

  LogEntry.prototype = {
    debug: function() {log.debug(getLastItem(arguments))},
    info : function() {log.info(getLastItem(arguments))},
    warn : function() {log.warning(getLastItem(arguments))},
    error: function() {log.err(getLastItem(arguments))}
  }
  return new LogEntry();
}

switch(process.env.NODE_ENV) {
  case 'prod':
  	Logger = logEntries();
    break;
  case 'second':
    Logger = require('./bunyan');
    break;
  case 'stage':
    Logger = logEntries();
    break;
  default:
    Logger = require('./bunyan');
}

module.exports = Logger;
