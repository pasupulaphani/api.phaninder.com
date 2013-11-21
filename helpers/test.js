
var configUtil = require('./configUtil.js');

var config = require('../config')();
console.log(config.secret);

console.log(configUtil.getDBURL(config));
