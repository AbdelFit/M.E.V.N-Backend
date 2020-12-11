const router = require('express').Router();
const UserController = require('../Controllers/UserController');
const middleware = require('../Middlewares');

// signup
router
	.route('/signup')	
	.post((...params) => UserController.signup(...params));

// login
router
	.route('/login')
	.post((...params) => UserController.login(...params));

// get, update, delete user
router
	.route('/:id')
	.get(middleware, (...params) => UserController.show(...params))
	.patch(middleware, (...params) => UserController.update(...params))
	.delete(middleware, (...params) => UserController.delete(...params));

module.exports = router;