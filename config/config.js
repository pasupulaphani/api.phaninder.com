var node_env = process.env.NODE_ENV || 'dev';
var db_env   = process.env.DB_ENV || 'dev';
var conf_dir = process.env.CONF_DIR || './env/';

function mergeObjs(target) {
	var sources = [].slice.call(arguments, 1);
	sources.forEach(function (source) {
		for (var prop in source) {
			target[prop] = source[prop];
		}
	});
	return target;
}

function getEnv() {
	console.log("Loading app in :" + node_env + " mode");
	var env = require(conf_dir + '/' + node_env + '.json');
	return env;
}

function getPJson() {
	var p_json = require('../package.json');
	return p_json;
}

function getDb() {
	var db = require(conf_dir + '/db.json');
	return db;
}

// ATM let config has all env.json and package.json props.
// Please note that env.json overrides package.json props.
function Config() {
	return (mergeObjs({}, getPJson(), getEnv(), getDb()));
};

module.exports = new Config;