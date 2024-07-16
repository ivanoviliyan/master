const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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

        return res.status(200).json({ message: "Login successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in login logic!" });
    }
};

module.exports = {
    userLogin
};


module.exports = {
    userLogin
};