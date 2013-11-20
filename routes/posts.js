
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

var loggedIn = require('../middleware/loggedIn');
var myEsc = require('../helpers/escape.js');

module.exports = function (app) {

	// get all posts : index
	app.get('/posts', loggedIn, function (req, res, next) {
		res.redirect("/");
	});

	// show the post : show
	app.get('/posts/:id', loggedIn, function (req, res, next) {
		var id = req.param('id');

		var queryBuilder = Post.findById(id);
		queryBuilder.populate('user');
		queryBuilder.exec(function (err, post) {
			if (err) return next(err);

			if (!post) return next(); // 404

			res.render('posts/show.jade', { post: post});
		});
	});

	// new post : new
	app.get('/posts/new', loggedIn, function (req, res, next) {
		res.render("posts/new.jade");
	});

	// edit a post : edit
	app.get('/posts/:id/edit', loggedIn, function (req, res, next) {
		var id = req.param('id');

		var queryBuilder = Post.findById(id, function (err, doc) {
			console.log(doc);
		});
		queryBuilder.populate('user');

		queryBuilder.exec(function (err, post) {
			if (err) return next(err);

			if (!post) return next(); // 404

			// valid user
			if (post.user._id != req.session.user) {
				return res.send(403);
			}

			res.render('posts/new.jade', { post: post});
		});
	});

	// insert a post : create
	app.post('/posts', loggedIn, function (req, res, next) {
		var title = req.param('title');
		var body = req.param('body');
		var user = req.session.user;

		Post.create({
			_id : myEsc.urlSeoEsc(title).toLowerCase(),
			title : title,
			body : body,
			user : user
		}, function (err, post) {
			if (err) throw next(err);
			res.redirect('/posts/' + post.id);
		});
		
	});

	// update a post : update
	app.put('/posts/:id', loggedIn, function (req, res, next) {
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
				body: req.param('body')
			}, function (err, numAffected) {
				if (err) return next(err);
				if (0 === numAffected) return next(err);
				res.redirect("/posts/"+id);
			});
		});

	});

	// delete a post : destroy
	app.delete('/posts/:id', loggedIn, function (req, res, next) {
		var id = req.param('id');

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
	});

}