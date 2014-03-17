var getDBURL = exports.getDBURL = function (config, db_server) {
	console.log(config + " " + db_server)
	var url = "";
	var db = eval("config."+db_server)

	switch (db.DBMS) {
		case "MongoDB":
			url = buildMongoURL(db.MongoDB);
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

var getSessionStore = exports.getSessionStore = function (config, db_server) {
console.log(config + " " + db_server)
	var db = eval("config."+db_server)

	switch (db.session_store) {
		case "MongoStore":
			return db.MongoStore;
		default:
			console.log("No config set");
	}

	return
}

// good way for an utils module
module.exports = exports;
