var mongoose    = require('mongoose');
var User        = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash        = require('../helpers/hash');
var crypto      = require('crypto');


exports.loginShow = function (req, res) {
	res.render('home.jade', {loginShow: true});
};


exports.createShow = function (req, res) {
	res.render('signup.jade');
};


exports.create = function (req, res, next) {
	var email = cleanString(req.param('email'));
	var pass = cleanString(req.param('pass'));
	if (!email || !pass) {
		return invalid();
	}

	User.findById(email, function (err, user) {
		if (err) throw next(err);

		if (user) {
			return res.render('signup.jade', {exists: true});
		}

		crypto.randomBytes(16, function (err, bytes) {
			if (err) throw next(err);

			var user = {_id: email};
			user.salt = bytes.toString('utf8');
			user.hash = hash(pass, user.salt);

			User.create(user, function (err, new_user) {
				if (err) {
					if (err instanceof mongoose.Error.ValidationError) {
						return invalid();
					}
					return next(err);
				}

				// success
				req.session.isLoggedIn = true;
				req.session.user = email;
				console.log("user "+email+" created successfully");
				return res.redirect('/');

			})
		});
	});

	function invalid() {
		res.render('signup.jade', {invalid: true});
	}
};

exports.login = function (req, res) {
	var email = cleanString(req.param('email'));
	var pass = cleanString(req.param('pass'));
	if (!email || !pass) {
		return invalid();
	}
	email = email.toLowerCase();

	User.findById(email, function (err, user) {
		if (err) throw next(err);

		if (user) {
			// success
			if (user.hash === hash(pass, user.salt)) {
				req.session.isLoggedIn = true;
				req.session.user = email;
				console.log("user "+email+" has loggedin");
				return res.redirect('/');
			}
		} else {
			return invalid();
		}
	});

	function invalid() {
		res.render(
			'home.jade',
			{
				invalid: true,
				loginShow: true
			}
		);
	}
};

