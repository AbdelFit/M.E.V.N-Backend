const jwt = require('jsonwebtoken');

function auth(req, res, next) {
	const tokenBearer = req.header('Authorization').split(" ");
	const token = tokenBearer[1];

	if(!token) return res.status(401).send('Access denied!');

	try {
		const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET);
		req.auth_token = verifiedToken;
		next();
	} catch (error) {
		res.status(401).send('Invalid Token');
	}
}

module.exports = auth;