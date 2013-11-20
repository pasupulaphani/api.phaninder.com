
module.exports = function(app) {

	// 404s
	app.use(function(req, res, next) {
		res.status(404);

		if (req.accepts('html')) {
			return res.send("<h2>404 : Page not found</h2>");
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
		res.send('500 : An internal error occured')
	})
}