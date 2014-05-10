var mongoose    = require('mongoose');
var session     = require('express-session');
var MemoryStore = session.MemoryStore;

var config     = require('../config');
var configUtil = require('../../app/helpers/configUtil.js');

// not designed for production
var expressSessionStore = function (app) {

	app.use(session({
		secret: config.secret,
		store: new MemoryStore(),
		key: 'express.sid'
	}));
};

module.exports = expressSessionStore;
