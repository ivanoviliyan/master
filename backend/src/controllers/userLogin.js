const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userLogin = async (req, res) => {
    try {
        const userCredentials = req.body;
        const validUser = await User.findOne({ email: userCredentials.email });

        if (!validUser) {
            return res.status(401).json({ message: "Wrong email!" });
        }

        const isPasswordValid = await bcrypt.compare(userCredentials.password, validUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong Password!" });
        }

        const secretKey = 'your-256-bit-secret';
        const token = jwt.sign(
            { id: validUser._id, email: validUser.email }, 
            secretKey,                                     
            { expiresIn: '1h' }                            
        );

        return res.status(200).json({ token, userId: validUser._id });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in login logic!" });
    }
};

const createUser = async (req, res) => {
    try {
        let users = req.body;

        // If the request body is not an array, wrap it in an array
        if (!Array.isArray(users)) {
            users = [users];
        }

        const createdUsers = [];

        for (const user of users) {
            if (!user.password) {
                return res.status(400).json({ message: "Password is required for each user!" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            const document = await User.create(user);
            createdUsers.push(document);
        }

        return res.status(201).json({ data: createdUsers, message: 'User(s) created successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user(s)!" });
    }
}


module.exports = {
    userLogin,
    createUser
};