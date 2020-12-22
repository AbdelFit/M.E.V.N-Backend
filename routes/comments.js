const router = require('express').Router();
const middleware = require('../Middlewares');
const CommentController = require('../Controllers/CommentController');
const { CommentValidation, CommentValidationResults } = require('../Validation/CommentExists');
const { CommentCreateValidation, CommentCreateValidationResults } = require('../Validation/CommentCreate');
const { CommentUpdateValidation, CommentUpdateValidationResults } = require('../Validation/CommentUpdate');

// get all comments, create new comment
router
	.route('/')
	.post(middleware, CommentCreateValidation, CommentCreateValidationResults, (...params) => CommentController.create(...params));

// get, update, delete comment
router
	.route('/:id')
	.patch(middleware, CommentUpdateValidation, CommentUpdateValidationResults, (...params) => CommentController.update(...params))
	.delete(middleware, CommentValidation, CommentValidationResults, (...params) => CommentController.delete(...params));

module.exports = router;