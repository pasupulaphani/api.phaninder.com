var mongoose   = require('mongoose');
var express    = require('express');
var Fiber      = require('fibers');
if (['prod', 'second'].indexOf(process.env.NODE_ENV) >= 0) {
	require('newrelic')
}
var util = require('util');
var config     = require('./config/config');
var configUtil = require('./app/helpers/configUtil.js');

var models     = require('./app/models');
var routes     = require('./config/routes');
var middleware = require('./config/express');

var server     = null;
var is_cleaning_up = false;
var db_server  = process.env.DB_ENV || 'dev';

mongoose.connection.on("connected", function(ref) {
	console.log("Connected to " + db_server + " DB!");

	var app = express();
	app.locals.home_dir = __dirname;
	app.locals.db = {
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

	middleware(app, config);
	routes(app);

	port = process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 3000;
	ip = process.env.OPENSHIFT_NODEJS_IP;

	server = app.listen(port, ip, function() {
		console.log('listening on port ' + port);
	});
});

var test1 = function() {
	console.error('Failed to connect to DB ' + db_server + ' ERR: ');

	// if (['primary', 'secondary'].indexOf(db_server) < 0) {return gracefulExit();}
// 	console.log(util.inspect(server.listeners('connection')));
// mongoose.connection.removeListener('error', test1);
	// clean up DB connections and free the address/port
	doAsynCleanUp(function () {

	new_db_server = db_server === "dev" ? "secondary" : "dev"
	console.error('Retry connecting to ' + new_db_server);
	setTimeout(function(){startServerWith(new_db_server)}, 300);
	});

}

// If the connection throws an error
mongoose.connection.on("error", test1);



// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection to DB :' + db_server + ' disconnected');
});


mongoose.connection.on('close', function () {
	console.log('Mongoose default connection with DB :' + db_server + ' is closed');
});


function stopServer () {
	var fiber = Fiber.current;
	if (server) {
			console.log("still closing");
		server.close( function () {
			fiber.run('Closed out remaining http connections.');
		});
			server = null;
	} else { 
		setTimeout(function() {
			fiber.run('Http Server is not running');
		}, 0);
 };

	var results = Fiber.yield();

	return results;
}

function doAsynCleanUp (callback) {
    // Test if ANY/ALL page animations are currently active

    var doAsynCleanUp = setInterval(function () {
        if (!is_cleaning_up) { // any page animations finished
        	console.log("is_cleaning_up");
            clearInterval(doAsynCleanUp);
            doAsynCleanUp1(callback);
        }
        console.log("waiting");
    }, 25);
};

function doAsynCleanUp1 (callback) {
console.log( "running fiber");


is_cleaning_up = true;
	Fiber(function () {
		var res = stopServer();
		console.log(res);

		mongoose.connection.close( function (err) {
			if (err) { callback(err) };
			console.log("done closing Mongoose");
		});
		is_cleaning_up = false;
		callback && callback(null);
	}).run();
}


var gracefulExit = function() {
	doAsynCleanUp(function(err) {process.exit()});
}


var startServerWith = function(l_db_server) {
	try {
		db_server = l_db_server;
		mongoose.connect(configUtil.getDBURL(config, db_server));
		console.log("Trying to connect to DB " + db_server);
	} catch (err) {
		console.log("Sever failed " , err.message);
	}
};


// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);


startServerWith(db_server);