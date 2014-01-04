var validEmail = exports.validEmail = function (email) {
	var validator = require('email-validator');
 	return validator.validate(email);
}

// status:
//		T (trash),
//		Y (ok to show),
//		U (Under construction),
//    M (Misc)
var validStatus = exports.validStatus = function (status) {
	var patt = new RegExp("[TYUM]");
	return patt.test(status);
}

// good way to export an utils module
module.exports = exports;