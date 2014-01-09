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
	var node_env = process.env.NODE_ENV || 'dev';
	console.log("Loading app in :" + node_env + " mode");
	var env = require('./env/' + node_env + '.json');
	return env;
}

function getPJson() {
	var p_json = require('../package.json');
	return p_json;
}

// ATM let config has all env.json and package.json props.
// Please note that env.json overrides package.json props.
function Config() {
	return (mergeObjs({}, getPJson(), getEnv()));
};

module.exports = new Config;