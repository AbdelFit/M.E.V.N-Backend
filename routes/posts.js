const router = require('express').Router();
const middleware = require('../Middlewares');
const PostController = require('../Controllers/PostController');
const { PostValidation, PostValidationResults } = require('../Validation/PostExists');
const { PostCreateValidation, PostCreateValidationResults } = require('../Validation/PostCreate');
const { PostUpdateValidation, PostUpdateValidationResults } = require('../Validation/PostUpdate');

// get all posts, create new post
router
	.route('/')
	.get(middleware, (...params) => PostController.index(...params))
	.post(middleware, PostCreateValidation, PostCreateValidationResults, (...params) => PostController.create(...params));

// search posts
router
	.route('/search')
	.get(middleware, (...params) => PostController.search(...params));

// get, update, delete post
router
	.route('/:id')
	.patch(middleware, PostUpdateValidation, PostUpdateValidationResults, (...params) => PostController.update(...params))
	.delete(middleware, PostValidation, PostValidationResults, (...params) => PostController.delete(...params));

module.exports = router;