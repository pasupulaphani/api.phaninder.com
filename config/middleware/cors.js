// ## CORS middleware
//

var config = require('../config');

var allowCrossDomain = exports.allowCrossDomain = function(req, res, next) {

    res.header('Access-Control-Allow-Origin', config.staticHost);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
    res.header('Access-Control-Allow-Credentials', true);

    next();
};

module.exports = exports;
