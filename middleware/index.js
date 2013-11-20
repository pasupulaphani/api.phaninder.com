
var express = require('express');

module.exports = function (app) {
	app.use(express.logger('dev'));

	// use mongo-connet later
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

