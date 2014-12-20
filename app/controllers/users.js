var mongoose    = require('mongoose');
var User        = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var cryptoUtils = require('../helpers/cryptoUtils');
var crypto      = require('crypto');


exports.createShow = function (req, res) {
	res.render('users/signup.jade');
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
			return res.render('users/signup.jade', {exists: true});
		}

		crypto.randomBytes(16, function (err, bytes) {
			if (err) throw next(err);

			var user = {_id: email};
			user.salt = bytes.toString('utf8');
			user.hash = cryptoUtils.hash(pass, user.salt);

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
		res.render('users/signup.jade', {invalid: true});
	}
};

exports.login = function (req, res) {
	var email = cleanString(req.param('email'));
	var pass = cleanString(req.param('password'));
	if (!email || !pass) {
		return invalid();
	}
	email = email.toLowerCase();

	User.findById(email, function (err, user) {
		if (err) throw next(err);

		if (user && user.hash === cryptoUtils.hash(pass, user.salt)) {

			req.session.isLoggedIn = true;
			req.session.user = email;
			console.log("user "+email+" has loggedin");
			return res.sendStatus(200);

		} else {
			return invalid();
		}
	});

	function invalid() {
		res.status(401).end();
	}
};


exports.getLoginStatus = function (req, res) {
// return res.sendStatus(200);
	if (req.session && req.session.user) {
		return res.sendStatus(200);
	} else {
		return res.sendStatus(401);
	}
};