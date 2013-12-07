
var configUtil = require('./configUtil.js');

var config = require('../lib/config');
console.log(config.secret);

console.log(configUtil.getDBURL(config));
