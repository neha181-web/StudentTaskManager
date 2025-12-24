const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    description: { 
        type: String,
        trim: true 
    },
    priority: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Medium',
        trim: true 
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Make sure this line is exactly like this:
module.exports = mongoose.model('Task', TaskSchema);