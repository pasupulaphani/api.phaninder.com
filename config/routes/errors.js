module.exports = function(app) {

	var logger = require('../logger');

	// 404s
	app.use(function(req, res, next) {
		res.status(404);

		if (req.accepts('html')) {
			return res.render('404.jade', {title: '404: Page Not Found'});
		}

		if (req.accepts('json')) {
			return res.send("{status : 404, error : 'Page not found'");
		}

		res.type('txt')
		res.send("404 : page not found")
	})

	// 500
	app.use(function(err, req, res, next) {
		console.log('error at %s\n', req.url, err);


		// handle CSRF token errors here
		if (err.code !== 'EBADCSRFTOKEN') {
			return next(err)
		} else {
			res.status(403)
			res.send('session has expired or form tampered with')
		}

		res.status(500);
		res.render('500.jade', {title:'500: An internal error occured', error: err.stack});
		logger.error(err)
	})
}