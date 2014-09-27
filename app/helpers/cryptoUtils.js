var crypto  = require('crypto');

var hash = exports.hash = function (pass, salt) {
	var hash = crypto.createHash('sha512');
	hash.update(pass, 'utf8')
	hash.update(salt, 'utf8')
	return hash.digest('base64');
}


var random = function(howMany, chars) {
	chars = chars 
		|| "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
	var rnd = crypto.randomBytes(howMany)
		, value = new Array(howMany)
		, len = chars.length;

	for (var i = 0; i < howMany; i++) {
		value[i] = chars[rnd[i] % len]
	};

	return value.join('');
}

var getUID = exports.getUID = function(len) {
    return random(len, "0123456789");
};

module.exports = exports;