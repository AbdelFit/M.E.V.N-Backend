const { validationResult, body, param } = require("express-validator");
const Post = require('../Models/Post');

exports.PostUpdateValidationResults = (req, res) => {
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

exports.PostUpdateValidation = [
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
		.withMessage('Text is required!'),
	param('id')
		.trim()
		.exists()
		.custom(async value => {
			const post = await Post.findById(value);
			if (!post) {
				return Promise.reject('Post not found!');
			}
		})
];