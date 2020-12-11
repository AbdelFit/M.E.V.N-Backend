const mongoose = require('mongoose');

const post = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: false
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'comment'
		}
	]
});

module.exports = Post = mongoose.model('post', post);