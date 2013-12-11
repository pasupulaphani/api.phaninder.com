var posts    = require('../../app/controllers/posts');
var loggedIn = require('../middleware/loggedIn');

module.exports = function (app) {

	app.get('/posts', posts.all);
	app.get('/posts/:id', posts.show);
	app.get('/posts/new', loggedIn, posts.new);
	app.get('/posts/:id/edit', loggedIn, posts.edit);

	app.put('/posts', loggedIn, posts.create);

	app.post('/posts/:id', loggedIn, posts.update);
	app.post('/posts/:id/status', loggedIn, posts.setStatus);

	app.delete('/posts/:id', loggedIn, posts.destroy);
}