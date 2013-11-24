
var express    = require('express');
var MongoStore = require('connect-mongo')(express);
var path       = require('path');
var logger = require('../lib/logger');


module.exports = function (app, config) {

	var static_dir = path.join(app.locals.app_dir + '/public');
	app.use(express.static(static_dir));
	app.use(express.favicon(static_dir + '/images/favicon.ico'));

	// basic express logger. Useful for dubugging locally on stdout
	if (config.mode === 'dev') {
		app.use(express.logger(config.mode));
	}

	// maintain session stuff
	app.use(express.cookieParser());
	app.use(express.session({
		secret: config.secret,
		maxAge: new Date(Date.now() + 3600000),
		store: new MongoStore(config.MongoStore)
	}));
	app.use(express.bodyParser());

	// to enable RESTFUL methods
	app.use(express.methodOverride());

	app.use(function (req, res, next) {
		logger.info({req: req}, 'start request');

		// expose sessions to views
		res.locals.session = req.session;
		next();
	})


}

