var users = require('../../app/controllers/users');

module.exports = function (app) {

	// Shouldn't require this unless you screwed database
	app.get('/signup', users.createShow);
	app.post('/signup', users.create);

	app.get('/login', users.loginShow);
	app.post('/login', users.login);

	app.get('/logout', function (req, res) {
		req.session.isLoggedIn = false;
		console.log("user "+req.session.user+" has loggedout");
		req.session.user = null;
		return res.redirect('/');
	});
}
