const express = require('express');
const cors = require('cors');
const companyRoutes = require('./routes/companyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const userLoginRoutes = require('./routes/userLoginRoutes');

const app = express();

// Use CORS middleware
app.use(cors({
    origin: '*', // Allow all origins (for testing purposes only)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  

// Middleware for parsing JSON
app.use(express.json());

// Register routes
app.use('/companies', companyRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);
app.use('/login', userLoginRoutes);

module.exports = app;