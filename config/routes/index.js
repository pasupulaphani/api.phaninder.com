var r_login  = require('./login');
var r_posts  = require('./posts');
var r_errors = require('./errors');

var index    = require('../../app/controllers/index');

module.exports = function(app) {

	app.get('/proxy.html', function (req, res) {
		return res.render('proxy.jade');
	});

	app.get('/', index.home);
	app.get('/about', index.about);
	app.get('/contact', index.contact);

	// other routes
	r_login(app);  //handle login, signup and logout
	r_posts(app);  // post CRUD

	r_errors(app); // handle errors (404 and 500)

}
