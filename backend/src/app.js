const express = require('express');
const companyRoutes = require('./routes/companyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const userLoginRoutes = require('./routes/userLoginRoutes')

const app = express();

app.use(express.json());

// Apply middleman middleware to a specific route pattern

// Register routes
app.use('/companies', companyRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);
app.use('/login', userLoginRoutes);

module.exports = app;