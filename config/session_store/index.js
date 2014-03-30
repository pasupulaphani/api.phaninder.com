var mongoose   = require('mongoose');
var session    = require('express-session');
var RedisStore = require('connect-redis')(session);

var config     = require('./config');
var configUtil = require('../app/helpers/configUtil.js');


// this is not working for some wierd reason
var expressSessionStore = exports.expressSessionStore = function (app) {
	console.log("called");
	app.use(session({
		secret: config.secret,
		store: null,
		cookie: { secure: true }
	}));
};

module.exports = redisSessionStore;