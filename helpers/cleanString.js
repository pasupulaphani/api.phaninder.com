
module.exports = function validString (str) {
	if ('string' != typeof str) {
		str = "";
	}
	return str.trim();
}
