var logentries  = require('node-logentries');

var config      = require('../config');
var logSettings = config.logSettings;

var log = logentries.logger({
  token:process.env.LOGENTRIES_TOKEN
});
log.level(logSettings.logFileLevel);

// later dev
// log.on('log',function(logline){
//    console.log( logline )
// });

module.exports = log;
