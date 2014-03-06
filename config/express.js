var express    = require('express');
var MongoStore = require('connect-mongo')(express);
var path       = require('path');
var logger     = require('../config/logger');
var loggedIn   = require('./middleware/loggedIn');
var appUtils   = require('../app/helpers/appUtils');

var configUtil = require('../app/helpers/configUtil.js');

module.exports = function (app, config) {

	var static_dir = path.join(app.locals.home_dir + '/public');

	app.use(express.compress());
	// static should be above cookie parser to not set cookie for static files
	app.use(express.static(static_dir));
	app.use(express.favicon(static_dir + '/favicon.ico'));

	//Set views path, template engine and default layout
	app.set('views', app.locals.home_dir + '/app/views');
	app.set('view engine', 'jade');

	// basic express logger. Writes to stdout
	app.use(
		express.logger(process.env.NODE_ENV === 'dev' ? 'dev' : '')
	);

	// maintain session stuff
	app.use(express.cookieParser());
	app.use(express.session({
		secret: config.secret,
		maxAge: new Date(Date.now() + 36000),
		store: new MongoStore(configUtil.getSessionStore(config, app.locals.db_server))
	}));
	app.use(express.bodyParser());

	// to enable RESTFUL methods
	app.use(express.methodOverride());

	app.use(function (req, res, next) {

		// action after response
		var afterResponse = function() {
			logger.info({req: req}, "End request");
		}
		res.on('finish', afterResponse);
		res.on('close', afterResponse);

		// actions before response
		logger.info({req: req}, "Start request");

		// expose sessions to views
		res.locals = {
			session : req.session,
			site    : config.site,
			mode    : process.env.NODE_ENV,
			url     : {
				host: req.host,
				path: req.path},
			staticHost : config.staticHost
		};

		if (loggedIn) {res.locals.infoStatus = appUtils.infoStatus }

		// blocking operation but only for dev
		if (process.env.NODE_ENV === 'dev') {
			var url = config.staticHost+'/static_dev_dependencies.json';
			appUtils.setStaticDependencies(res, url, next)
		} else {
			next();
		}

		//next();
	})


}

