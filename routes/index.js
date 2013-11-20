
var r_login = require('./login');
var r_posts = require('./posts');
var r_errors = require('./errors');

var mongoose = require('mongoose');
var Post = mongoose.model('Post');

module.exports = function(app) {

	app.get('/', function (req, res, next) {
		Post.find().sort('created').exec(function (err, posts) {
			if (err) throw next(err);
			res.render('home.jade', {posts: posts});
		});
	});

	// routes
	r_login(app);  //handle login, signup and logout
	r_posts(app);  // post CRUD
	r_errors(app); // handle errors (404 and 500)
}
