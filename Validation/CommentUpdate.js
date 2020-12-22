const { validationResult, body, param } = require("express-validator");
const Post = require('../Models/Post');
const Comment = require('../Models/Comment');

exports.CommentUpdateValidationResults = (req, res) => {
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

exports.CommentUpdateValidation = [
	body('post')
		.trim()
		.exists()
		.not()
		.isEmpty()
		.withMessage('Post is required!')
		.custom(async value => {
			const post = await Post.findById(value);
			if(!post) return Promise.reject('Post not found!');
		}),
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
			const comment = await Comment.findById(value);
			if (!comment) return Promise.reject('Comment not found!');
		})
];