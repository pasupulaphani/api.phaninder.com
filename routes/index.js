
var r_login = require('./login');
var r_posts = require('./posts');
var r_errors = require('./errors');

module.exports = function(app) {

	app.get('/', function (req, res, next) {
		res.redirect("/posts");
	});

	// routes
	r_login(app);  //handle login, signup and logout
	r_posts(app);  // post CRUD

	r_errors(app); // handle errors (404 and 500)

}
