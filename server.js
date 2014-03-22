var mongoose   = require('mongoose');
var Fiber      = require('fibers');
if (['prod', 'second'].indexOf(process.env.NODE_ENV) >= 0) {
	require('newrelic')
}

var models     = require('./app/models');
var routes     = require('./config/routes');
var middleware = require('./config/express');

var db         = require('./config/db');
var db_server = 'dev';
var app       = require('./app');

var appServer = function () {
	console.log("started");

	app.locals.home_dir = __dirname;
	console.log(db_server);
	app.locals.db       = {
		server: db_server,
		db    : mongoose.connection.db
	};

	middleware(app);
	routes(app);

	port = process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 3000;
	ip = process.env.OPENSHIFT_NODEJS_IP;

	server = app.listen(port, ip, function() {
		console.log('listening on port ' + port);
	});

	server.addListener('sessionStoreDown', function () {
		console.log("from sessionStoreDown")
	});
}


function startServer (callback) {
console.log( "running fiber");

	Fiber(function () {
		db_server = db();
		console.log(db_server + ' DB fully initialized');

		appServer();

		callback && callback(null);
		console.log("done");
	}).run();
}


var gracefulExit = function() {
	cleanUp(function() {process.exit()});
}


// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

startServer(function (err) {
	if (err) throw err;
	console.log("Server started")
});