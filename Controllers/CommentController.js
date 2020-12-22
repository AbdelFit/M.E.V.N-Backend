const Comment = require('../Models/Comment');
const Post = require('../Models/Post');
const User = require('../Models/User');

module.exports = {
	// add new comment
	async create(req, res) {
		// create new comment	
		const comment = new Comment({
			...req.body,
			date: new Date(Date.now()).toLocaleString(),
			user: req.auth_token._id
		});

		try {
			// push comment_id to the user
			await User.findByIdAndUpdate(
				comment.user, 
				{$push: {comments: comment._id}}, 
				{new: true}
			);

			// push comment_id to the post
			await Post.findByIdAndUpdate(
				comment.post, 
				{$push: {comments: comment._id}}, 
				{new: true}
			);

			// save comment
			await comment.save();

			// return the new post with user's info
			await comment.populate({ path: 'user', select: 'username' })
									 .execPopulate();
			await comment.populate('post').execPopulate();
		
			res.status(200).send(comment);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// update comment
	async update(req, res) {
		try {
			// get req
			const text = req.body.text;

			// check if the auth user has access to change it
			let comment = await Comment.findOne({
				_id: req.params.id,
				user: req.auth_token._id
			});
			if(!comment) return res.status(401).send('Access denied!');
	
			// change comment
			comment.text = text;

			await comment.save();

			await comment.populate({ path: 'user', select: 'username' }).execPopulate();
			await comment.populate('post').execPopulate();
	
			res.status(200).send(comment);
		} catch (error) {
			res.status(400).send(error);
		}
	},

	// delete comment
	async delete(req, res) {
		try {
			// check if the auth user has access to delete it
			const comment = await Comment.findOne({
				_id: req.params.id,
				user: req.auth_token._id
			});
			if(!comment) return res.status(401).send('Access denied!');

			// delete the comment
			await User.findByIdAndUpdate(
				req.auth_token._id, 
				{$pull: {comments: comment._id}}
			);
			await Post.findByIdAndUpdate(
				comment.post, 
				{$pull: {comments: comment._id}}
			);
			await Comment.findByIdAndDelete(comment._id);

			res.status(200).send('Comment deleted!');
		} catch (error) {
			res.status(400).send(error);
		}
	}
}