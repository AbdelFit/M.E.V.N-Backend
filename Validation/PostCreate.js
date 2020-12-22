const { validationResult, body } = require("express-validator");

exports.PostCreateValidationResults = (req, res) => {
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
};

exports.PostCreateValidation = [
	body('title')
		.trim()
		.exists()
		.not()
		.isEmpty()
		.withMessage('Title is required!')
		.isLength({ max: 80 }),
	body('text')
		.trim()
		.exists()
		.not()
		.isEmpty()
		.withMessage('Text is required!')
];