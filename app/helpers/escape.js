var urlSeoEsc = exports.urlSeoEsc = function (str) {

	if (!str) {return ''};

	str = str.
		replace(/[^a-zA-Z0-9-_\s]/g,''). //replace except alphabits, numbers, spaces, _, -
		trim().
		replace(/[\s_-]+/g,"-");         // now replace multiple spaces, _, - with - (seo friendly)

	return escape(str);            // just incase
}

// good way for an utils module
module.exports = exports;