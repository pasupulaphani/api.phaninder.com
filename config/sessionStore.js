var mongoose   = require('mongoose');
var express    = require('express');
var MongoStore = require('connect-mongo')(express);

var config     = require('./config');
var configUtil = require('../app/helpers/configUtil.js');

var mongoSessionStore = exports.mongoSessionStore = function (app) {
	session_store_options = configUtil.getSessionStore(config, app.locals.db.server);

	app.use(express.session({
		secret: config.secret,
		maxAge: new Date(Date.now() + 36000),
		store: new MongoStore({
			db              : mongoose.connection.db,
			collection      : session_store_options.collection,
			clear_interval  : session_store_options.clear_interval,
			auto_reconnect  : session_store_options.auto_reconnect
		})
	}));
};

var expressSessionStore = exports.expressSessionStore = function (app) {
	console.log("called");
	app.use(express.session({
		secret: config.secret,
		store: null,
		cookie: { secure: true }
	}));
};
// good way to export an utils module
module.exports = exports;