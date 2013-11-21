
var express = require('express');
var path    = require('path');

var app_dir    = path.join(__dirname + '/..');
var static_dir = path.join(app_dir + '/public');

module.exports = function (app) {
	app.use(express.logger('dev'));

	// use mongo-connet later
	app.use(express.static(static_dir));
	app.use(express.favicon(static_dir + '/images/favicon.ico'));
	app.use(express.cookieParser());
	app.use(express.session({secret: 'what am i doing'}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// expose sessions to views
	app.use(function (req, res, next) {
		res.locals.session = req.session;
		next();
	})
}

