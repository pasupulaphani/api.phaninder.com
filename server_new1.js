var mongoose   = require('mongoose');
var express    = require('express');
var Fiber      = require('fibers');
if (['prod', 'second'].indexOf(process.env.NODE_ENV) >= 0) {
	require('newrelic')
}

var models     = require('./app/models');
var routes     = require('./config/routes');
var middleware = require('./config/express');

var db         = require('./config/db');

var server = function () {
	console.log("started");
	var app = express();

	app.locals.home_dir = __dirname;
	console.log(db_server);
	app.locals.db       = {
		server: db_server,
		db    : mongoose.connection.db
	};


	// this is to escape all the session creations and logging when
	// load balancer, uptime bots are polling
	app.use('/up', function (req, res, next) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		resp = {
			"env" : process.env.NODE_ENV,
			"DB"  : app.locals.db.server
		}
		return res.end(JSON.stringify(resp));
	});

	middleware(app);
	routes(app);

	port = process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 3000;
	ip = process.env.OPENSHIFT_NODEJS_IP;

	server = app.listen(port, ip, function() {
		console.log('listening on port ' + port);
	});
}



function startServer (callback) {
console.log( "running fiber");

	Fiber(function () {
		db_server = db();
		console.log(db_server + ' DB fully initialized');

		server();

		callback && callback(null);
	}).run();
}


var gracefulExit = function() {
	cleanUp(function() {process.exit()});
}


// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

startServer(function (err) {
	if (err) throw err;
});