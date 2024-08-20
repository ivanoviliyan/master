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

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getMember
};
