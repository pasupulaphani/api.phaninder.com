var posts    = require('../../app/controllers/posts');
var loggedIn = require('../middleware/loggedIn');

module.exports = function (app) {

	app.get('/posts', posts.all);
	app.get('/posts/new', loggedIn, posts.new);
	app.get('/posts/:id/edit', loggedIn, posts.edit);
	app.get('/posts/:id/:seo_url?', posts.show);


	app.post('/posts', loggedIn, posts.create);

	app.put('/posts/:id', loggedIn, posts.update);
	app.patch('/posts/:id/:seo_url?', loggedIn, posts.patch);

	app.delete('/posts/:id', loggedIn, posts.destroy);

	// Seting up param to ease up stuff in controller
	app.param('id', posts.post);
}