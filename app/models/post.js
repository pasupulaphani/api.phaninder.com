var mongoose = require('mongoose');
var appUtil = require('../helpers/appUtils.js');

var PostSchema = mongoose.Schema({
	_id : {type: String, trim: true, lowercase: true},
	seo_url : {type: String, trim: true, lowercase: true},
	title : {type: String, trim: true, unique: true},
	preface : {type: String, trim: true},
	body : {type: String},
	tags : {type: Array, default: []},
	created : {type: Date, default: Date.now},
	modified : {type: Date, default: Date.now},
	user : {type: String, ref: 'User'},
	status : {type: String, default: 'P', validate: appUtil.validStatus }
});

mongoose.model('Post', PostSchema);

