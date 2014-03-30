var posts    = require('../../app/controllers/posts');
var loggedIn = require('../middleware/loggedIn');

module.exports = function (app) {

	app.get('/posts', posts.all);
	app.get('/posts/new', loggedIn, posts.new);
	app.get('/posts/:id', posts.show);
	app.get('/posts/:id/edit', loggedIn, posts.edit);

	app.post('/posts', loggedIn, posts.create);

	app.put('/posts/:id', loggedIn, posts.update);
	app.put('/posts/:id/status', loggedIn, posts.setStatus);

	app.delete('/posts/:id', loggedIn, posts.destroy);

	// Seting up param to ease up stuff in controller
	app.param('id', posts.post);
}