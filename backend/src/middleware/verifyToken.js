const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    try {
        const secretKey = 'your-256-bit-secret';
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Save the decoded token to the request object for use in other routes
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token!" });
    }
};

module.exports = verifyToken;