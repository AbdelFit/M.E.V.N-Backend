const { body, validationResult } = require("express-validator");
const User = require('../Models/User');

exports.UserLoginValidationResults = (req, res, next) => {
	const result = validationResult(req);

	if(!result.isEmpty()) {
		const errors = result.errors;
		let msg = "";

		if(errors.length > 0) {
			errors.forEach(error => msg += error.msg + " ");
		} else {
			msg = errors[0].msg;
		}

		res.status(400).send(msg);
	}

	next();
};

exports.UserLoginValidation = [
	body('auth')
		.trim()
		.not()
		.isEmpty()
		.withMessage('E-mail/Username is required!')
		.custom(async value => {
			return await User.findOne({$or: [
				{ email: value },
				{ username: value }
			] }).then(user => {
				if (!user) {
					return Promise.reject('E-mail/Username or password are incorrect!');
				}
			});
		}),
	body('password')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Password is required!')
		.isLength({ min: 8 })
		.withMessage('Password should be at least 8 characters long!')
];