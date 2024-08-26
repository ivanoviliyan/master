const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    task: {
        type: String,
        enum: ['Scripting', 'Script Changes', 'Quality Assurance', 'Data checking', 'Field Work', 'Overlay'],
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
