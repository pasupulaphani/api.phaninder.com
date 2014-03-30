var mongoose   = require('mongoose');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);

var config     = require('../config');
var configUtil = require('../../app/helpers/configUtil.js');

var mongoSessionStore = function (app) {
	
	session_store_options = configUtil.getSessionStore(config, app.locals.db.server);

	app.use(session({
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


module.exports = mongoSessionStore;