const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		createIndexes: {
			unique: true
		}
	},
	email: {
		type: String,
		required: true,
		createIndexes: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true,
		min: 8
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'post'
		}
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'comment'
		}
	]
});

/*user.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});*/

module.exports = User = mongoose.model('user', user);