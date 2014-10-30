var mongoose   = require('mongoose');
var Fiber      = require('fibers');

var config     = require('./config');
var configUtil = require('../app/helpers/configUtil.js');

var db = {
	server  : process.env.DB_ENV || 'dev'
};
var app       = require('../app');

mongoose.connection.on("connected", function() {
	console.log("Connected to " + db.server + " DB!");
});


// If the connection throws an error
mongoose.connection.on("error", function(err) {
	console.error('Failed to connect to DB ' + db.server + ' ERR: ', err);
	mongoose.connection.close();
	_connectDB(db.server)
});


// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection to DB :' + db.server + ' disconnected');
});


mongoose.connection.on('close', function () {
	console.log('Mongoose default connection with DB :' + db.server + ' is closed');
});


function _connectDB (db_name, callback) {
	mongoose.connect(configUtil.getDBURL(config, db.server), function (err) {
		if (err) {
			var given_db = process.env.DB_ENV || 'dev';
			db.server = db_name === given_db ? "secondary" : given_db
			console.error('Retry connecting to ' + db.server);
			return _connectDB(db.server, callback)
		} else {
			callback && callback();
		}
	});
}

var connect = exports.connect = function () {

	var fiber = Fiber.current;

	_connectDB(db.server, function () {
		setTimeout(function(){fiber.run(db.server)});
	})

	var results = Fiber.yield();

	return results;
}

var getName = exports.getName = function () {
	return db.server;
}

module.exports = exports;