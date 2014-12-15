var Fiber = require('fibers');
var email_validator = require('email-validator');

var handleRequest = require('./handleRequest');

var validEmail = exports.validEmail = function (email) {
 	return email_validator.validate(email);
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

var buildSeoUrl = exports.buildSeoUrl = function(req) {
	return req.protocol + '://' + req.headers.host + req.originalUrl + '/' + (req.post.seo_url || '')
};

// good way to export an utils module
module.exports = exports;