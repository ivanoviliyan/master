const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const userLoginRoutes = require('./routes/userLoginRoutes');
const taskRoutes = require('./routes/taskRoutes');
const verifyToken = require('./middleware/verifyToken');

const app = express();

// Use CORS middleware
app.use(cors({
    origin: '*', // Allow all origins (for testing purposes only)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware for parsing JSON
app.use(express.json());

// Register the /login route without the verifyToken middleware
app.use('/login', userLoginRoutes);

// Apply verifyToken middleware for all routes below this line
app.use(verifyToken);

// Register routes (protected by verifyToken middleware)

app.use('/projects', projectRoutes);
app.use('/users', userRoutes);
app.use('/task', taskRoutes);

module.exports = app;
