const app = require('./src/app');
const connectToDatabase = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(Number(PORT), () => {
            console.log(`Server started successfully on port ${PORT}!`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
};

startServer();