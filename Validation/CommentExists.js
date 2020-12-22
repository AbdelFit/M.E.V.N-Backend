const { validationResult, param } = require("express-validator");
const Comment = require('../Models/Comment');

exports.CommentValidationResults = (req, res) => {
	const result = validationResult(req);

	if(!result.isEmpty()) {
		const error = result.errors[0].msg;

		res.status(400).send(error);
	}
};

exports.CommentValidation = [
	param('id')
		.trim()
		.exists()
		.custom(async value => {
			const comment = await Comment.findById(value);
			if (!comment) return Promise.reject('Comment not found!');
		})
];