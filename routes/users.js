const router = require('express').Router();
const UserController = require('../Controllers/UserController');
const middleware = require('../Middlewares');
const { UserSignUpValidation, UserSignUpValidationResults } = require('../Validation/UserSignUp');
const { UserLoginValidation, UserLoginValidationResults } = require('../Validation/UserLogin');
const { UserUpdateValidation, UserUpdateValidationResults } = require('../Validation/UserUpdate');
const { UserValidation, UserValidationResults } = require('../Validation/UserExists');

// signup
router
	.route('/signup')	
	.post(UserSignUpValidation, UserSignUpValidationResults, (...params) => UserController.signup(...params));

// login
router
	.route('/login')
	.post(UserLoginValidation, UserLoginValidationResults, (...params) => UserController.login(...params));

// get, update, delete user
router
	.route('/:id')
	.get(middleware, UserValidation, UserValidationResults, (...params) => UserController.show(...params))
	.patch(middleware, UserUpdateValidation, UserUpdateValidationResults, (...params) => UserController.update(...params))
	.delete(middleware, UserValidation, UserValidationResults, (...params) => UserController.delete(...params));

module.exports = router;