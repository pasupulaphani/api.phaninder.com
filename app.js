
var mongoose   = require('mongoose');
var express    = require('express');

var config     = require('./lib/config');
var configUtil = require('./helpers/configUtil.js');

var models     = require('./models');
var routes     = require('./routes');
var middleware = require('./middleware');

mongoose.connect(configUtil.getDBURL(config), function(err) {
	if (err) throw err;

	var app = express();
	app.locals.app_dir = __dirname;

	middleware(app, config);
	routes(app);

	app.listen(process.env.port, function() {
		console.log('listening on port ' + process.env.port);
	});
});
