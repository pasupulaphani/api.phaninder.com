
var getDBURL = exports.getDBURL = function (config) {
	var url = "";

	switch (config.db) {
		case "MongoDB":
			url = buildMongoURL(config.MongoDB);
			break;
		default:
			console.log("No config set");
	}

	return url;
}

var buildMongoURL = function (db_props) {

	console.log("Building MongoDB connection url");

	var dbUrl = 'mongodb://';
	dbUrl += db_props.username+':'+db_props.password+'@';
	dbUrl += db_props.host+':'+db_props.port;
	dbUrl += '/' + db_props.db;

	console.log("URL: " + dbUrl);
	return dbUrl;
}

var getSessionStore = exports.getSessionStore = function (config) {

	switch (config.session_store) {
		case "MongoStore":
			return config.MongoStore;
		default:
			console.log("No config set");
	}

	return
}

// good way for an utils module
module.exports = exports;
