const { body, validationResult } = require("express-validator");
const User = require('../Models/User');

exports.UserSignUpValidationResults = (req, res, next) => {
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

exports.UserSignUpValidation = [
	body('email')
		.trim()
		.exists()
		.not()
		.isEmpty()
		.withMessage('Email is required!')
		.isEmail()
		.withMessage('E-mail must be valid!')
		.custom(async value => {
			return await User.findOne({ email: value }).then(user => {
				if (user) {
					return Promise.reject('Email already exists!');
				}
			});
		}),
	body('username')
		.trim()
		.exists()
		.not()
		.isEmpty()
		.withMessage('Username is required!')
		.custom(async value => {
			return await User.findOne({ username: value }).then(user => {
				if (user) {
					return Promise.reject('Username already exists!');
				}
			});
		}),
	body('password')
		.trim()
		.exists()
		.not()
		.isEmpty()
		.withMessage('Password is required!')
		.isLength({ min: 8 })
		.withMessage('Password should be at least 8 characters long!')
];