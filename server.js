var mongoose   = require('mongoose');
var express    = require('express');
if (['prod', 'second'].indexOf(process.env.NODE_ENV) >= 0) {
	require('newrelic')
}

var config     = require('./config/config');
var configUtil = require('./app/helpers/configUtil.js');

var models     = require('./app/models');
var routes     = require('./config/routes');
var middleware = require('./config/express');

var db_server  = process.env.DB_ENV || 'primary';

mongoose.connection.on("connected", function(ref) {
	console.log("Connected to " + db_server + " DB!");

	var app = express();
	app.locals.home_dir = __dirname;
	app.locals.db_server = db_server;

	// this is to escape all the session creations and logging when
	// load balancer, uptime bots are polling
	app.use('/up', function (req, res, next) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		resp = {
			"env" : process.env.NODE_ENV,
			"DB"  : app.locals.db_server
		}
		return res.end(JSON.stringify(resp));
	});

	middleware(app, config);
	routes(app);

	port = process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 3000;
	ip = process.env.OPENSHIFT_NODEJS_IP;

	app.listen(port, ip, function() {
		console.log('listening on port ' + port);
	});
});


// If the connection throws an error
mongoose.connection.on("error", function(err) {
	console.error('Failed to connect to DB ' + db_server + ' on startup ', err);

	if (['primary', 'secondary'].indexOf(db_server) < 0) {return}

	new_db_server = db_server === "primary" ? "secondary" : "primary"
	console.error('Retry connecting to ' + new_db_server);
	startServerWith(new_db_server)
});


// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB :' + db_server + ' disconnected');
});
 

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB :' + db_server + ' is disconnected through app termination');
    process.exit(0);
  });
});


var startServerWith = function(l_db_server) {
	try {
		db_server = l_db_server;
		mongoose.connect(configUtil.getDBURL(config, db_server));
		console.log("Trying to connect to DB " + db_server);
	} catch (err) {
		console.log("Sever failed " , err.message);
	}
};


startServerWith(db_server);