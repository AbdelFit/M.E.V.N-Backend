const { body, validationResult, param } = require("express-validator");
const User = require('../Models/User');

exports.UserUpdateValidationResults = (req, res, next) => {
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

exports.UserUpdateValidation = [
	body('bio')
		.trim()
		.optional()
		.isLength({ max: 3 })
		.withMessage('Bio should be 250 characters long!'),
	body('oldPassword')
		.trim()
		.optional()
		.isLength({ min: 8 })
		.withMessage('Old Password should be at least 8 characters long!'),
	body('newPassword')
		.trim()
		.optional()
		.isLength({ min: 8 })
		.withMessage('New Password should be at least 8 characters long!')
		.equals(body('oldPassword'))
		.withMessage('New password should be different than the old one'),
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