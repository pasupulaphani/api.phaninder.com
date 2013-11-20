
var mongoose = require('mongoose');
var express = require('express');

var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');

mongoose.connect('mongodb://localhost/myblog', function(err) {
	if (err) throw err;

	var app = express();

	middleware(app);
	routes(app);

	app.listen(3000, function() {
		console.log('listening on port 3000');
	});
});
