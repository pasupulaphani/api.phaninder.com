var express    = require('express');

var app = module.exports = express();

// this is to escape all the session creations and logging when
// load balancer, uptime bots are polling
app.use('/up', function (req, res, next) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	resp = {
		"env" : process.env.NODE_ENV,
		"DB"  : app.locals.db_server
	}
	return res.end(JSON.stringify(resp));
});
