const mongoose = require('mongoose');
const {taskSchema} = require('./task.model');

// Stage schema
const stageSchema = new mongoose.Schema({
    stage_name: {type: String, default: "New Stage"},
    description: {type: String},
    stage_tasks: {type: [taskSchema]},
    created_at: {type: Date, default: new Date()},
    edit_active: {type: Boolean, default: false},
    options_menu_open: {type: Boolean, default: false},
    tasks_done: {type: Number, default: 0}
})

// Stage model
const Stage = mongoose.model("Stage", stageSchema);

// Exports
module.exports = {
    Stage,
    stageSchema
}