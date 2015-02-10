var mongoose = require('mongoose');
var Post = mongoose.model('Post');

var myEsc       = require('../helpers/escape.js');
var appUtils    = require('../helpers/appUtils.js');
var cryptoUtils = require('../helpers/cryptoUtils');
var logger      = require('../../config/logger');

// todo: did refactor controller 
// but still can make changes by adding autorization to routes
// as we have app.param defined

// get all posts : index
// Todo : retrive only required files instaea of all
exports.all = function (req, res, next) {
	var status = req.param('status') ? req.param('status') : 'P'

	if (!req.session.user && !appUtils.dispPost(status)) return next(); // 404

	Post.find({'status':status}).sort({'created': -1}).exec(function (err, posts) {
		if (err) return next(err);

		res.json(posts);
	});
};

// same as "post.show" but this is left for other controllers to use
var go = exports.go = function (req, res, next, id) {
	var queryBuilder = Post.findById(id);
	queryBuilder.populate('user');
	queryBuilder.exec(function (err, post) {
		if (err) return next(err);

		if (!post || (!req.session.user && !appUtils.dispPost(post.status))) return next(); // 404

		post.user = post.user.id;
		res.json([post]);
	});
};


// app.param stuff
exports.post = function(req, res, next, id) {
	var queryBuilder = Post.findById(id);
	queryBuilder.populate('user');
	queryBuilder.exec(function (err, post) {

		if (err) return next(err);
		if (!post || (!req.session.user && !appUtils.dispPost(post.status))) return next(); // 404

		req.post = post;
		req.post.user = post.user.id;
		next();
	});
};


// show the post : show
exports.show = function (req, res, next) {
	if (!req.post) return next(); // 404

	res.json([req.post]);
};


var formatPostObj = function (post) {

	post.seo_url = myEsc.urlSeoEsc(post.seo_url).toLowerCase();
	post.created = (new Date(post.created));
	post.modified = Date.now();

	return post;
}

// insert a post : create
exports.create = function (req, res, next) {

	var user = req.session.user;
	var new_post = req.body;

	if (!new_post.title) return res.status(400).send({ error: 'title is must' });

	logger.info({req: req}, 'Creating post: %s', new_post.title);

	new_post.created = new_post.created || Date.now();
	new_post._id = new_post._id || cryptoUtils.getUID(6);
	new_post.user = user;

	new_post = formatPostObj(new_post);

	Post.create(new_post, function (err, post) {
		if (err) return next(err);
		res.json(post);
	});
};


// update a post : update
exports.update = function (req, res, next) {

	if (!req.post) return next(); // 404

	var post = req.post;

	// valid user
	if (post.user != req.session.user) {
		return res.sendStatus(403);
	}

	var edit_post = formatPostObj(req.body);
	delete edit_post._id;

	post.update(edit_post, function (err, numAffected) {
		if (err) return next(err);
		if (0 === numAffected) return next(err);
		res.sendStatus(200);
	});
};

// set status of a post: see Post model
exports.patch = function (req, res, next) {
	if (!req.post) return next(); // 404
	var post   = req.post;
	var status = req.param('status');

	if (!appUtils.validStatus(status)) return res.status(400).send({ error: 'status must be P, M, U or T' });

	// valid user
	if (post.user != req.session.user) {
		return res.sendStatus(403);
	}

	var query = {_id: post.id, user: req.session.user}

	post.update({
		status: status
	}, function (err, numAffected) {
		if (err) return next(err);
		if (0 === numAffected) return next(err);
		res.sendStatus(200);
	});
};

// delete a post : destroy
exports.destroy = function (req, res, next) {
	var id = req.param('id');

	logger.info({req: req}, 'Deleting post: %s', id);
	//old way of extracting; just leaving it as we don't use this
	Post.findOne({_id: id}, function (err, post) {
		if (err) return next(err);

		// valid user
		if (post.user != req.session.user) {
			return res.sendStatus(403);
		}

		post.remove(function (err) {
			if (err) return next(err);
			res.redirect('/');
		});
	});
};
