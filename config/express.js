var express        = require('express');

// middleware modules
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var compress       = require('compression');
var favicon        = require('static-favicon');
var morgan         = require('morgan');
var methodOverride = require('method-override');

var path           = require('path');

var config         = require('./config');
var configUtil     = require('../app/helpers/configUtil.js');
var appUtils       = require('../app/helpers/appUtils');
var logger         = require('../config/logger');
var loggedIn       = require('./middleware/loggedIn');
var sessionStore   = require('./session_store/mongo_store');

module.exports = function (app) {

	var static_dir = path.join(app.locals.home_dir + '/public');

	app.use(compress());
	// static should be above cookie parser to not set cookie for static files
	app.use(express.static(static_dir));
	app.use(favicon(static_dir + '/favicon.ico'));

	//Set views path, template engine and default layout
	app.set('views', app.locals.home_dir + '/app/views');
	app.set('view engine', 'jade');

	// basic express logger. Writes to stdout
	//morgan - previously logger
	app.use(
		morgan(process.env.NODE_ENV === 'dev' ? 'dev' : '')
	);

	session_store_options = configUtil.getSessionStore(config, app.locals.db.server);
	// maintain session stuff
	app.use(cookieParser());
	sessionStore(app);
	app.use(bodyParser());

	// to enable RESTFUL methods
	app.use(methodOverride());

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

