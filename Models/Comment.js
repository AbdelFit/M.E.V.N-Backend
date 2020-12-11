const mongoose = require('mongoose');

const comment = new mongoose.Schema({
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
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'post',
		required: true
	}
});

module.exports = Comment = mongoose.model('comment', comment);