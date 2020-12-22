const { validationResult, param } = require("express-validator");
const Post = require('../Models/Post');

exports.PostValidationResults = (req, res) => {
	const result = validationResult(req);

	if(!result.isEmpty()) {
		const error = result.errors[0].msg;

		res.status(400).send(error);
	}
};

exports.PostValidation = [
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