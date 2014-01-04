var validEmail = exports.validEmail = function (email) {
	var validator = require('email-validator');
 	return validator.validate(email);
}

var infoStatus =  exports.infoStatus = {	
	U:"Under construction",
	Y:"Displayed",
	T:"Trashed",
	M:"Misc"};

var validStatus = exports.validStatus = function (status) {
	return (status in infoStatus)
}

// good way to export an utils module
module.exports = exports;