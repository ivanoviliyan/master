const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory!"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        default: 'Not Started'
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    history: [{
        task: {
            type: String,
            enum: ['Scripting', 'Script Changes', 'Quality Assurance', 'Data checking', 'Field Work', 'Overlay'],
        },
        duration: {
            start: {
                type: Date,
            },
            end: {
                type: Date,
            }
        }
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);