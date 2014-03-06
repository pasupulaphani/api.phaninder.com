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

var startServerWith = function(db_server) {
	mongoose.connect(configUtil.getDBURL(config, db_server), function(err) {
		if (err) {
			new_db_server = db_server === "primary" ? "secondary" : "primary"
			console.error('Failed to connect to DB ' + db_server + ' on startup - trying to ' + new_db_server, err);
			setTimeout(startServerWith(new_db_server), 5000);
		}

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
};

startServerWith("primary");