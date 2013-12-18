var mongoose = require('mongoose');
var Post = mongoose.model('Post');


exports.home = function(req, res, next) {
	// for the time being
	res.redirect("/posts");
};

exports.about = function(req, res, next) {
	var id = 'about'

	var queryBuilder = Post.findById(id);
	queryBuilder.populate('user');
	queryBuilder.exec(function (err, post) {
		if (err) return next(err);

		if (!post || (!req.session.user && post.status != 'Y')) return next(); // 404

		res.render('posts/show.jade', { post: post});
	});
};