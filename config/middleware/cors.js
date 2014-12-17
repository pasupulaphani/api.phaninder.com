// ## CORS middleware
//
var allowCrossDomain = exports.allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://local-phaninder.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    next();
};

module.exports = exports;
