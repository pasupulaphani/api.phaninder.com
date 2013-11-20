
var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
	_id : {type: String, trim: true, lowercase: true},
	title : {type: String, trim: true, unique: true},
	body : {type: String},
	created : {type: Date, default: Date.now},
	modified : {type: Date, default: Date.now},
	user : {type: String, ref: 'User'}
});

mongoose.model('Post', PostSchema);

