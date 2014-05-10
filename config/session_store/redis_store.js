var session    = require('express-session');
var RedisStore = require('connect-redis')(session);

var config     = require('./config');
var configUtil = require('../app/helpers/configUtil.js');

var redisSessionStore = function (app) {
	session_store_options = configUtil.getSessionStore(config, app.locals.db.server);

	app.use(session({
		secret: config.secret,
		maxAge: new Date(Date.now() + 36000),
		store: new RedisStore({
			db              : redis.createClient()
			//todo
		})
	}));
};


module.exports = redisSessionStore;