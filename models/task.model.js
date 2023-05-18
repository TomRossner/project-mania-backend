const mongoose = require('mongoose');
const {messageSchema} = require('./message.model');

// Task schema
const taskSchema = new mongoose.Schema({
    created_at: {type: Date, default: new Date()},
    current_stage: {type: Object},
    project: {type: Object},
    title: {type: String, default: "New Task"},
    due_date: {type: Date, default: new Date().toDateString()},
    isDone: {type: Boolean, default: false},
    edit_active: {type: Boolean, default: false},
    files: {type: Array},
    messages: {type: [messageSchema]},
    priority: {type: Object},
    description: {type: String},
    labels: {type: Array},
    subtitle: {type: String}
})

// Task model
const Task = mongoose.model("Task", taskSchema);

// Exports
module.exports = {
    Task,
    taskSchema
}