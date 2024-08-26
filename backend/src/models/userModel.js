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
        required: false,
        default: 'Scripter'
    },
    level: {
        type: String,
        enum: ["Senior", "Junior", "Mid"],
        default: 'Junior',
        required: false,
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
    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
