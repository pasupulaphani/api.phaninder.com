var mongoose = require('mongoose');
var Post = mongoose.model('Post');

var myEsc    = require('../helpers/escape.js');
var logger   = require('../../config/logger');

// get all posts : index
exports.all = function (req, res, next) {
	var status = req.param('status') ? req.param('status') : 'Y'

	if (!req.session.user && status != 'Y') return next(); // 404

	Post.find({'status':status}).sort('created').exec(function (err, posts) {
		if (err) throw next(err);
		res.render('home.jade', {posts: posts});
	});
};

// show the post : show
exports.show = function (req, res, next) {
	var id = req.param('id');

	var queryBuilder = Post.findById(id);
	queryBuilder.populate('user');
	queryBuilder.exec(function (err, post) {
		if (err) return next(err);

		if (!post || (!req.session.user && post.status != 'Y')) return next(); // 404

		res.render('posts/show.jade', { post: post});
	});
};

// new post : new
exports.new = function (req, res, next) {
	res.render("posts/new.jade", {edit: {raw: req.param('raw')}});
};

// edit a post : edit
exports.edit = function (req, res, next) {
	var id = req.param('id');

	var queryBuilder = Post.findById(id);
	queryBuilder.populate('user');

	queryBuilder.exec(function (err, post) {
		if (err) return next(err);

		if (!post) return next(); // 404

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
	});
};

// insert a post : create
exports.create = function (req, res, next) {
	var title = req.param('title');
	var body = escape(req.param('body'));
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
	var id = req.param('id');

	Post.findOne({_id: id}, function (err, post) {
		if (err) return next(err);

		// valid user
		if (post.user != req.session.user) {
			return res.send(403);
		}

		var query = {_id: id, user: req.session.user}

		post.update({
			title: req.param('title'),
			body: escape(req.param('body')),
			modified: Date.now()
		}, function (err, numAffected) {
			if (err) return next(err);
			if (0 === numAffected) return next(err);
			res.redirect("/posts/"+id);
		});
	});
};

// set status of a post: see Post model
exports.setStatus = function (req, res, next) {
	var id = req.param('id');
	var status = req.param('status');

	if (["Y", "U", "T"].indexOf(status) == -1) throw new Error('status must be Y, U or T');

	Post.findOne({_id: id}, function (err, post) {
		if (err) return next(err);

		// valid user
		if (post.user != req.session.user) {
			return res.send(403);
		}

		var query = {_id: id, user: req.session.user}

		post.update({
			status: status
		}, function (err, numAffected) {
			if (err) return next(err);
			if (0 === numAffected) return next(err);
			res.redirect("/posts/" + id);
		});
	});
};

// delete a post : destroy
exports.destroy = function (req, res, next) {
	var id = req.param('id');

	logger.info({req: req}, 'Deleting post: %s', id);
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
