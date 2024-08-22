const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (users.length > 0) {
            return res.status(200).json({ data: users, message: "Users retrieved successfully!" });
        }

        return res.status(404).json({ message: "No existing users!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving users!" });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (user) {
            return res.status(200).json({ data: user, message: "User retrieved successfully!" });
        }

        return res.status(404).json({ message: "User not found!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving user by ID!" });
    }
}

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


const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.body;

        // Hash the password if it's being updated
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });

        if (updatedUser) {
            return res.status(200).json({ data: updatedUser, message: "User updated successfully!" });
        }

        return res.status(404).json({ message: "User not found!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating user!" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);

        if (user) {
            return res.status(200).json({ message: "User deleted successfully!" });
        }

        return res.status(404).json({ message: "User not found and cannot be deleted!" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting user!" });
    }
}

const getMember = async (req, res) => {
    try {
        const member = req.params.member;
        const findMember = await User.find({ name: { $regex: member, $options: 'i' } });
        if (!findMember || findMember.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(findMember);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const changeEmail = async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldEmail, newEmail } = req.body;

        // Validate the user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the old email matches the user's current email
        if (user.email !== oldEmail) {
            return res.status(400).json({ message: 'Old email does not match' });
        }

        // Validate the new email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Invalid new email format' });
        }

        // Update the user's email
        user.email = newEmail;
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Email updated successfully' });

    } catch (error) {
        console.error('Error changing email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        // Verify token and get user ID from token
        const decoded = jwt.verify(token, 'your-256-bit-secret');
        const userId = decoded.id;

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        // Find user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Respond with success message
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getMember,
    changeEmail,
    resetPassword
};
