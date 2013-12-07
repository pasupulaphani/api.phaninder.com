var posts    = require('../../app/controllers/posts');
var loggedIn = require('../middleware/loggedIn');

module.exports = function (app) {

	app.get('/posts', loggedIn, posts.all);
	app.get('/posts/:id', loggedIn, posts.show);
	app.get('/posts/new', loggedIn, posts.new);
	app.get('/posts/:id/edit', loggedIn, posts.edit);

	app.post('/posts', loggedIn, posts.create);

	app.put('/posts/:id', loggedIn, posts.update);

	app.delete('/posts/:id', loggedIn, posts.destroy);
}