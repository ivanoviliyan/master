const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is mandatory!"], 
        trim: true 
    },
    role: {
        type: String,
        enum: [
            "Scripter", 
            "Custom scripter", 
            "Quality assurance", 
            "Data processing", 
            "Project manager", 
            "Field work"
        ],
        required: true,
    },
    level: {
        type: String,
        enum: ["Senior", "Junior", "Mid"],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    telephoneNumber: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
