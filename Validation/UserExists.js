const { validationResult, param } = require("express-validator");
const User = require('../Models/User');

exports.UserValidationResults = (req, res, next) => {
	const result = validationResult(req);

	if(!result.isEmpty()) {
		const error = result.errors[0].msg;

		res.status(400).send(error);
	}

	next();
};

exports.UserValidation = [
	param('id')
		.trim()
		.exists()
		.custom(async value => {
			const user = await User.findById(value);
			if (!user) {
				return Promise.reject('User unknown!');
			}
		})
];