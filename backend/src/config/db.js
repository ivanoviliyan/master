const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
    try {
        const dbURL = process.env.DB_URL; // Fetch the DB_URL from environment variables
        if (!dbURL) {
            throw new Error('DB_URL is not defined in .env file');
        }
        await mongoose.connect(dbURL);
        console.log('Connected to the database successfully!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

module.exports = connectToDatabase;
