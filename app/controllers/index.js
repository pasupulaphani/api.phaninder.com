var mongoose = require('mongoose');
var Post = mongoose.model('Post');

var posts = require('./posts');

exports.home = function(req, res, next) {
	// for the time being
	res.redirect("/posts");
};

exports.about = function(req, res, next) {
	posts.go(req, res, next, 'about')
};

exports.contact = function(req, res, next) {
	posts.go(req, res, next, 'contact')
};