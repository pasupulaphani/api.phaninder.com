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
		if (err) throw next(err);

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


// new post : new
exports.new = function (req, res, next) {
	res.render("posts/new.jade");
};


// edit a post : edit
exports.edit = function (req, res, next) {
	if (!req.post) return next(); // 404
	var post = req.post;

	// valid user
	if (post.user._id != req.session.user) {
		return res.send(403);
	}

	res.render('posts/new.jade',
		{
			post: post
		}
	);
};


// insert a post : create
exports.create = function (req, res, next) {
	var title = req.param('title');
	var body = req.param('body');
	var user = req.session.user;
	var seo_url = req.param('seo_url');

	if (seo_url == "") {
		seo_url = title;
	};

	if (!title) throw new Error('title is must');
	logger.info({req: req}, 'Creating post: %s', title);

	Post.create({
		_id     : cryptoUtils.getUID(6),
		seo_url : myEsc.urlSeoEsc(seo_url).toLowerCase(),
		title   : title,
		body    : body,
		user    : user
	}, function (err, post) {
		if (err) throw next(err);
		res.redirect('/posts/' + post.id);
	});
};


// update a post : update
exports.update = function (req, res, next) {
	if (!req.post) return next(); // 404
	var post = req.post;
	var seo_url = req.param('seo_url');

	// valid user
	if (post.user._id != req.session.user) {
		return res.send(403);
	}

	if (seo_url == "") {
		seo_url = req.param('title');
	};

	var query = {_id: post.id, user: req.session.user}

	post.update({
		seo_url : myEsc.urlSeoEsc(seo_url).toLowerCase(),
		title: req.param('title'),
		body: req.param('body'),
		created: (new Date(req.param('created'))),
		modified: Date.now()
	}, function (err, numAffected) {
		if (err) return next(err);
		if (0 === numAffected) return next(err);
		res.redirect("/posts/"+post.id);
	});
};

// set status of a post: see Post model
exports.patch = function (req, res, next) {
	if (!req.post) return next(); // 404
	var post   = req.post;
	var status = req.param('status');

	if (!appUtils.validStatus(status)) throw new Error('status must be P, M, U or T');

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
