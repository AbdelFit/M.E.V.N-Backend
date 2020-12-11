const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const Post = require('../Models/Post');
const Comment = require('../Models/Comment');

const SALT_WORK_FACTOR = 10;

module.exports = {
	// sign up
	async signup(req, res) {
		try {
			// validate req


			// check if username or email already exists
			const userExist = await User.findOne({$or: [
				{email: req.body.email},
				{username: req.body.username}
			]});
			if(userExist) return res.status(400).send('Email already exists!');

			// get credentials
			let {username, email, password} = req.body;

			// hash password
			const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
			password = await bcrypt.hash(password, salt);
			
			// create new user
			let user = new User({
				username: username,
				email: email,
				password: password
			});

			// save user
			let savedUser = await user.save();
		
			res.status(200).send(savedUser);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// log in
	async login(req, res) {
		try {
			// validate req
		
			
			// get credentials
			const {auth, password} = req.body;

			// check if username or email exists and the password is valid
			const user = await User.findOne({$or: [
				{email: auth},
				{username: auth}
			]});		
			const validPwd = await bcrypt.compare(password, user.password);
			if(!validPwd || !user) return res.status(400).send('The email/username or password is wrong!');
		
			// add token to user
			const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
			const loggedUser = {
				id: user._id,
				username: user.username,
				email: user.email,
				posts: user.posts,
				comments: user.comments,
				token: token
			};

			res.status(200).header('auth_token', token).send(loggedUser);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// get user's info with posts and comments
	async show(req, res) {
		try {
			const user = await User.findById(req.params.id)								 
														 .populate({ 
																path: 'posts', 
																populate: { 
																	path: 'comments',
																	populate: {
																		path: 'user',
																		select: 'username'
																	}
																} 
														 	})
														 .populate({ 
																path: 'comments', 
															 	populate: { path: 'user', select: 'username' } 
															})
														 .exec();

			res.status(200).send(user);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// update user
	async update(req, res) {
		try {
			// valildate req


			// check if user exists and has the access to apply changes
			let user = await User.findOne({$and: [
				{_id: req.params.id},
				{_id: req.auth_token._id}
			]});
			if(!user) return res.status(401).send("Access denied!");

			// change username
			if(req.body.username) {
				const username = req.body.username;

				// check if username already exists
				if(username != user.username) {
					const userNameExist = await User.findOne({username: username});
					if(userNameExist) return res.status(400).send("This username already exists!");
				}
				
				user.username = username;
			}

			// change password
			if(req.body.oldPassword && req.body.newPassword) {
				let {oldPassword, newPassword} = req.body;

				// check if old password is valid
				const validPwd = await bcrypt.compare(oldPassword, user.password);
				if(!validPwd) return res.status(400).send('The old password is wrong!');
	
				// hash the new password
				const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
				newPassword = await bcrypt.hash(newPassword, salt);

				user.password = newPassword;
			}

			if(req.body.username || (req.body.oldPassword && req.body.newPassword)) {
				// save changes
				await user.save();
			}

			// add new token to user
			const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
			const loggedUser = {
				id: user._id,
				username: user.username,
				email: user.email,
				posts: user.posts,
				comments: user.comments,
				token: token
			};

			res.status(200).header('auth_token', token).send(loggedUser);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// delete user
	async delete(req, res) {
		try {
			// check if user exists and has the access to apply changes
			const user = await User.findOne({$and: [
				{_id: req.params.id},
				{_id: req.auth_token._id}
			]});
			if(!user) return res.status(401).send("Access denied!");

			await Post.deleteMany({user: req.params.id});
			await Comment.deleteMany({user: req.params.id});
			await User.findByIdAndDelete(req.params.id);

			res.status(200).send('User deleted!');
		} catch (error) {
			res.status(400).send(error);
		}
	}
}