const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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
        const user = req.body;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const document = await User.create(user);

        return res.status(201).json({ data: document, message: 'User created successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user!" });
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.body;

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
        const user = await User.findById(id);

        if (user) {
            await User.deleteOne({ _id: id });
            return res.status(200).json({ message: "User deleted successfully!" });
        }

        return res.status(404).json({ message: "User not found and cannot be deleted!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user!" });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};