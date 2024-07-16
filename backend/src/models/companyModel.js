const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is mandatory!"] 
    },
    password: { 
        type: String, 
        required: [true, "Password is mandatory"] 
    },
    email: { 
        type: String, 
        required: [true, "Email is mandatory"] 
    },
    country: { 
        type: String, 
        required: [true, "Country is mandatory"] 
    },
    city: { 
        type: String, 
        required: [true, "City is mandatory"] 
    },
    address: { 
        type: String, 
        required: [true, "Address is mandatory"] 
    },
    phone: { 
        type: String, 
        required: [true, "Phone number is mandatory"] 
    },
    website: { 
        type: String 
    },
    establishedYear: { 
        type: Number 
    },
    socialMedia: {
        linkedin: { 
            type: String 
        },
        twitter: { 
            type: String 
        },
        facebook: { 
            type: String 
        },
    },
    logo: { 
        type: String 
    },
    industry: {
        type: String,
        enum: [
            'Technology', 'Finance', 'Healthcare', 'Education',
            'Retail', 'Manufacturing', 'Real Estate',
            'Hospitality', 'Transportation', 'Other'
        ],
        required: [true, "Industry is mandatory"],
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    description: { 
        type: String 
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);