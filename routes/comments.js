const router = require('express').Router();
const middleware = require('../Middlewares');
const CommentController = require('../Controllers/CommentController');

// get all comments, create new comment
router
	.route('/')
	.get(middleware, (...params) => CommentController.index(...params))
	.post(middleware, (...params) => CommentController.create(...params));

// get, update, delete comment
router
	.route('/:id')
	.get(middleware, (...params) => CommentController.show(...params))
	.patch(middleware, (...params) => CommentController.update(...params))
	.delete(middleware, (...params) => CommentController.delete(...params));

module.exports = router;