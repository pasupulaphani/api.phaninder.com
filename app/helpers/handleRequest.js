var http = require('http');
var Fiber = require('fibers')

module.exports = function handleRequest(url) {
	var fiber = Fiber.current;

	http.get(url, function(res) {
	    var body = '';

	    res.on('data', function(chunk) {
	        body += chunk;
	    });

	    res.on('end', function() {
	    	var resp = JSON.parse(body);
	      fiber.run(resp);
	    });
	}).on('error', function(e) {
	      console.log("error: ", e);
	});

	var resp = Fiber.yield();
	return resp;
}