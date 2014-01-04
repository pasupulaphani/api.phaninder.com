var mongoose = require('mongoose');
var appUtil = require('../helpers/appUtils.js');

var Userschema = mongoose.Schema({
	_id: {type: String, lowercase: true, trim: true, validate: appUtil.validEmail},
	name: {first: String, last: String},
	salt: {type: String, required: true},
	hash: {type: String, required: true},
	created: {type: Date, default: Date.now}
});

mongoose.model('User', Userschema);