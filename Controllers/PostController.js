const Post = require('../Models/Post');
const User = require('../Models/User');
const Comment = require('../Models/Comment');

module.exports = {
	// get all posts with comments
	async index(req, res) {
		try {
			const posts = await Post.find()
															.sort({ date: 'desc' })
															.populate({ path: 'user', select: 'username' })
															.populate({ 
																path: 'comments', 
																populate: { path: 'user', select: 'username' },
																options: {
																	sort: { date: 'desc' }
																}
															})
															.exec();
		
			res.status(200).send(posts);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// add new post
	async create(req, res) {
		// create new post	
		const post = new Post({
			...req.body,
			date: new Date(Date.now()).toLocaleString(),
			user: req.auth_token._id
		});

		try {
			// push post_id to the user
			await User.findByIdAndUpdate(
				post.user, 
				{$push: {posts: post._id}}, 
				{new: true}
			);

			// save post
			await post.save();

			// return the new post with user's info
			await post.populate({ path: 'user', select: 'username' }).execPopulate();
			await post.populate({ 
									path: 'comments', 
				 					populate: { path: 'user', select: 'username' } 
								}).execPopulate();
		
			res.status(200).send(post);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// update post
	async update(req, res) {
		try {
			// get req
			const {title, text} = req.body;

			// check if the auth user has access to change post
			let post = await Post.findOne({
				_id: req.params.id,
				user: req.auth_token._id
			});
			if(!post) return res.status(401).send('Access denied!');
	
			// change post
			post.title = title;
			post.text = text;

			await post.save();

			await post.populate({ path: 'user', select: 'username' }).execPopulate();
			await post.populate({ 
									path: 'comments', 
									populate: { path: 'user', select: 'username' },
									options: {
										sort: { date: 'desc' }
									}
								}).execPopulate();
	
			res.status(200).send(post);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// delete post
	async delete(req, res) {
		try {
			// check if the auth user has access to delete post
			const post = await Post.findOne({
				_id: req.params.id,
				user: req.auth_token._id
			});
			if(!post) return res.status(401).send('Access denied!');

			// delete the post with all its comments
			await Comment.deleteMany({post: req.params.id});
			await User.findByIdAndUpdate(
				req.auth_token._id, 
				{$pull: {posts: req.params.id}}
			);
			await Post.findByIdAndDelete(req.params.id);

			res.status(200).send('Post deleted!');
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// search posts
	async search(req, res) {
		try {
			await Post.createIndexes({ "text": "text" });

			const query = req.query.q.toLowerCase();

			const posts = await Post.find({ $or: [
																{ title: { $regex: query, $options: 'i' } },
																{ text: { $regex: query, $options: 'i' } }
															] })
															.sort({date: 'desc'})
															.populate({ path: 'user', select: 'username' })
															.populate({ 
																path: 'comments', 
															 	populate: { path: 'user', select: 'username' } 
															})
															.exec();
		
			res.status(200).send(posts);
		} catch (error) {
			res.status(400).send(error);
		}
	}
}