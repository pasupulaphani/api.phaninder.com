
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var path    = require('path');

var app_dir    = path.join(__dirname + '/..');
var static_dir = path.join(app_dir + '/public');

module.exports = function (app, config) {
	app.use(express.logger('dev'));

	// use mongo-connet later
	app.use(express.static(static_dir));
	app.use(express.favicon(static_dir + '/images/favicon.ico'));
	app.use(express.cookieParser());
	app.use(express.session({
		secret: config.secret,
		maxAge: new Date(Date.now() + 3600000),
		store: new MongoStore(config.MongoStore)
	}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// expose sessions to views
	app.use(function (req, res, next) {
		res.locals.session = req.session;
		next();
	})
}

