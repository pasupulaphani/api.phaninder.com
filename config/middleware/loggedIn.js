module.exports = function loggedIn (req, res, next) {

	if (!(req.session && req.session.user)) {
		return res.sendStatus(401);
	}
	next();
}
