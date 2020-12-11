const router = require('express').Router();
const middleware = require('../Middlewares');
const PostController = require('../Controllers/PostController');

// get all posts, create new post
router
	.route('/')
	.get(middleware, (...params) => PostController.index(...params))
	.post(middleware, (...params) => PostController.create(...params));

// get, update, delete post
router
	.route('/:id')
	.get(middleware, (...params) => PostController.show(...params))
	.patch(middleware, (...params) => PostController.update(...params))
	.delete(middleware, (...params) => PostController.delete(...params));

module.exports = router;