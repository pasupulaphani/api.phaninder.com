var mongoose   = require('mongoose');
var Fiber      = require('fibers');

var config     = require('./config');
var configUtil = require('../app/helpers/configUtil.js');

var db_server  = process.env.DB_ENV || 'dev';
var app       = require('../app');

mongoose.connection.on("connected", function(ref) {
	console.log("Connected to " + db_server + " DB!");
});


// If the connection throws an error
mongoose.connection.on("error", function(err) {
	console.error('Failed to connect to DB ' + db_server + ' ERR: ', err);
	mongoose.connection.close();

});


// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection to DB :' + db_server + ' disconnected');
});


mongoose.connection.on('close', function () {
	console.log('Mongoose default connection with DB :' + db_server + ' is closed');
});




var db = module.exports = function () {

	var fiber = Fiber.current;

	// function connectDB (db_server, callback) {
		console.log("Trying to connect to DB " + db_server);
		// mongoose.connect(configUtil.getDBURL(config, db_server), function () {
		// 	fiber.run(db_server);
		// });

		var reConnectDB = function () {
			// if (['primary', 'secondary'].indexOf(db_server) < 0) {return process.exit();}

			db_server = db_server === "dev" ? "secondary" : "dev"
			console.error('Retry connecting to ' + db_server);
			setTimeout(function(){connectDB()}, 30);
		}


	function connectDB (db_server, callback) {
		mongoose.connect(configUtil.getDBURL(config, db_server), function (err) {
			if (err) {
				db_server = db_server === "dev" ? "secondary" : "dev"
				console.error('Retry connecting to ' + db_server);
				return connectDB(db_server, callback)
			} else {
				callback();
			}
		});
		// callback && callback();
	}

	connectDB(db_server, function () {
		setTimeout(function(){fiber.run(db_server)});
	})

	var results = Fiber.yield();

	return results;
}