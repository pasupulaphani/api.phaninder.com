var http = require('http');
var Fiber = require('fibers')

module.exports = function handleRequest(url) {
	var fiber = Fiber.current;

	http.get(url, function(res) {
		if (res.statusCode !== 200) {
			console.log(url + "returned : ", res.statusCode);
			var result = {statusCode: res.statusCode};
			fiber.run(result);
		} else {
			var body = '';

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				var result = JSON.parse(body);
				result.statusCode = res.statusCode
				fiber.run(result);
			});
		}
	}).on('error', function(e) {
		console.log("error: ", e);
		var result = {statusCode: res.statusCode};
		fiber.run(result);
	});

	var resp = Fiber.yield();
	return resp;
}