var validEmail = exports.validEmail = function (email) {
	var validator = require('email-validator');
 	return validator.validate(email);
}

var infoStatus = exports.infoStatus = {	
	U:"Under construction",
	P:"Published",
	T:"Trashed",
	M:"MiscPublished"};

// can view with no login (published)
var dispPost = exports.dispPost = function (status) {
	if (['P', 'M'].indexOf(status) >= 0) {
		return true;
	}
	return false
}

var validStatus = exports.validStatus = function (status) {
	return (status in infoStatus)
}

// good way to export an utils module
module.exports = exports;