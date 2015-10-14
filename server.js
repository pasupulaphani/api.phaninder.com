var mongoose   = require('mongoose');
var Fiber      = require('fibers');
var http       = require('http');
if (['prod', 'second'].indexOf(process.env.NODE_ENV) >= 0) {
	require('newrelic')
}

var models     = require('./app/models');
var routes     = require('./config/routes');
var middleware = require('./config/express');

var config     = require('./config/config');
var db         = require('./config/db');
var app        = require('./app');

var appServer = function () {
	console.log("Initializing app server");

	app.locals.home_dir = __dirname;

	app.locals.db_server = db.getName();

	middleware(app);
	routes(app);

	app.set('port', process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 3000);
	app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

	server = http.createServer(app).listen(app.get('port') ,app.get('ip'), function() {
		console.log('listening on port ' + app.get('port'));

		// Todo: set gid, uid in config
		config.gid ? process.setgid(config.gid) : '';
		config.uid ? process.setuid(config.uid) : '';
	});

	server.addListener('sessionStoreDown', function () {
		console.log("from sessionStoreDown")
	});
}


function startServer (callback) {

	Fiber(function () {
		db_server = db.connect();

		appServer();

		callback && callback(null);
	}).run();
}


var gracefulExit = function() {

	mongoose.connection.close();

	console.log("Exiting process")
	process.exit();
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

startServer(function (err) {
	if (err) throw err;
	console.log("Server started")
});