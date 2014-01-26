
var appUtils = require('./appUtils.js');

var config = require('../../config/config');
// console.log(config.staticJSDependencies);

// console.log(appUtils.validStatus('y'))

var url = 'http://static.phaninder.com/static_dev_dependencies.json';
var res = {locals : {}};
appUtils.setStaticDependencies(res, url);

