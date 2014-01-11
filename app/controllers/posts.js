var mongoose = require('mongoose');
var Post = mongoose.model('Post');

var myEsc    = require('../helpers/escape.js');
var appUtils = require('../helpers/appUtils.js');
var logger   = require('../../config/logger');

// todo: did refactor controller 
// but still can make changes by adding autorization to routes
// as we have app.param defined

// get all posts : index
exports.all = function (req, res, next) {
	var status = req.param('status') ? req.param('status') : 'P'

	if (!req.session.user && !appUtils.dispPost(status)) return next(); // 404

	Post.find({'status':status}).sort('created').exec(function (err, posts) {
		if (err) throw next(err);
		res.render('home.jade', {posts: posts});
	});
};

// same as "post.show" but this is left for other controllers to use
var go = exports.go = function (req, res, next, id) {
	var queryBuilder = Post.findById(id);
	queryBuilder.populate('user');
	queryBuilder.exec(function (err, post) {
		if (err) return next(err);

		if (!post || (!req.session.user && !appUtils.dispPost(post.status))) return next(); // 404

		res.render('posts/show.jade', { post: post});
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
		next();
	});
};


// show the post : show
exports.show = function (req, res, next) {
	res.render('posts/show.jade', { post: req.post});
};


// new post : new
exports.new = function (req, res, next) {
	res.render("posts/new.jade", {
		edit: {raw: req.param('raw')}
	});
};


// edit a post : edit
exports.edit = function (req, res, next) {
	var post = req.post;

	// valid user
	if (post.user._id != req.session.user) {
		return res.send(403);
	}

	res.render('posts/new.jade',
		{
			post: post,
			edit: {raw: req.param('raw')}
		}
	);
};


// insert a post : create
exports.create = function (req, res, next) {
	var title = req.param('title');
	var body = req.param('body');
	var user = req.session.user;

	if (!title) throw new Error('title is must');
	logger.info({req: req}, 'Creating post: %s', title);
	Post.create({
		_id : myEsc.urlSeoEsc(title).toLowerCase(),
		title : title,
		body : body,
		user : user
	}, function (err, post) {
		if (err) throw next(err);
		res.redirect('/posts/' + post.id);
	});
};


// update a post : update
exports.update = function (req, res, next) {
	var post = req.post;

	// valid user
	if (post.user._id != req.session.user) {
		return res.send(403);
	}

	var query = {_id: post.id, user: req.session.user}

	post.update({
		title: req.param('title'),
		body: req.param('body'),
		modified: Date.now()
	}, function (err, numAffected) {
		if (err) return next(err);
		if (0 === numAffected) return next(err);
		res.redirect("/posts/"+post.id);
	});
};

// set status of a post: see Post model
exports.setStatus = function (req, res, next) {
	var post   = req.post;
	var status = req.param('status');

	if (!appUtils.validStatus(status)) throw new Error('status must be P, M, U or T');

	// valid user
	if (post.user._id != req.session.user) {
		return res.send(403);
	}

	var query = {_id: post.id, user: req.session.user}

	post.update({
		status: status
	}, function (err, numAffected) {
		if (err) return next(err);
		if (0 === numAffected) return next(err);
		res.redirect("/posts/" + post.id);
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
			return res.send(403);
		}

		post.remove(function (err) {
			if (err) return next(err);
			res.redirect('/');
		});
	});
};
