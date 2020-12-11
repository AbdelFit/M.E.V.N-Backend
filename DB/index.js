const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
	await mongoose.connect(
		process.env.DB_CONNECTION,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		}
	);
};

module.exports = connectDB;